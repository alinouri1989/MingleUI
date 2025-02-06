import store from '../store/index.js';
import { useDispatch, useSelector } from "react-redux";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { createContext, useContext, useState, useEffect, useRef } from "react";

import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie.js";
import { removeGroupList, setGroupList, updateGroupInformations, updateUserInfoToGroupList } from "../store/Slices/Group/groupListSlice.js";
import { addNewUserToChatList, setInitialChatList, updateUserInfoToChatList } from "../store/Slices/chats/chatListSlice.js";
import { addMessageToGroup, addMessageToIndividual, addNewGroupChat, addNewIndividualChat, initializeChats, addArchive, removeArchive, removeIndividualChat, removeGroupChat } from "../store/Slices/chats/chatSlice.js";
import { deleteCallHistory, handleEndCall, handleIncomingCall, handleOutgoingCall, resetCallState, setCallRecipientList, setCallStartedDate, setInitialCalls, setIsCallStarted, setIsCallStarting, updateCallRecipientList } from "../store/Slices/calls/callSlice.js";
import { createAndSendOffer, handleRemoteSDP, sendSdp } from "../services/webRtcService.js";

import { servers } from "../constants/StunTurnServers.js";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken.js";
import { decryptMessage } from '../helpers/messageCryptoHelper.js';
import { useLocation, useNavigate } from 'react-router-dom';

const SignalRContext = createContext();

export const useSignalR = () => {
    const context = useContext(SignalRContext);

    if (!context) {
        throw new Error("useSignalR must be used within a SignalRProvider");
    }

    const { initializePeerConnection, chatConnection, notificationConnection, setLocalStream, handleAcceptCall, setRemoteStream, peerConnection, localStream, remoteStream, connectionStatus, callConnection, error, loading } = context;
    return { initializePeerConnection, chatConnection, notificationConnection, setLocalStream, handleAcceptCall, setRemoteStream, peerConnection, localStream, remoteStream, callConnection, connectionStatus, error, loading };
};

export const SignalRProvider = ({ children }) => {

    const dispatch = useDispatch();
    const location = useLocation();
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [chatConnection, setChatConnection] = useState(null);
    const [notificationConnection, setNotificationConnection] = useState(null);
    const [callConnection, setCallConnection] = useState(null);
    const { callId } = useSelector(state => state.call);
    const navigate = useNavigate();

    const { Individual, Group } = useSelector(state => state.chat);
    const { token } = useSelector(state => state.auth);
    const userId = getUserIdFromToken(token);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const callIdRef = useRef(callId);
    const peerConnection = useRef(null);

    const initializePeerConnection = async (callType) => {
        try {
            const pc = new RTCPeerConnection(servers);

            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000,
                },
                video: callType === 1 ? {
                    width: { ideal: 1920, max: 1920 },
                    height: { ideal: 1080, max: 1080 },
                    frameRate: { ideal: 45, max: 60 },
                } : false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setLocalStream(stream);
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });

            peerConnection.current = pc;
        } catch (error) {
            console.error("Kamera veya mikrofon erişiminde hata:", error);
        }
    };


    if (peerConnection.current) {
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("ICE Candidate oluşturuldu:", event.candidate);
                callConnection.invoke("SendIceCandidate", callIdRef.current, event.candidate);
            }
        };

        peerConnection.current.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            dispatch(setIsCallStarted(true));
            dispatch(setIsCallStarting(false));

            const currentDate = new Date().toISOString();
            dispatch(setCallStartedDate(currentDate));
        };

        peerConnection.current.oniceconnectionstatechange = () => {
            const state = peerConnection.current.iceConnectionState;

            if (state === "failed" || state === "closed") {
                dispatch(resetCallState())
                if (peerConnection.current) {
                    peerConnection.current.getSenders().forEach((sender) => {
                        if (sender.track) {
                            sender.track.stop();
                        }
                    });
                    peerConnection.current.close();
                    peerConnection.current = null;
                    setLocalStream(null);
                    setRemoteStream(null);
                }
            }
        };
    }

    useEffect(() => {
        callIdRef.current = callId;
    }, [callId]);


    useEffect(() => {
        const token = getJwtFromCookie();

        const chatConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7042/ChatHub", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        const notificationConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7042/NotificationHub", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        const callConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7042/CallHub", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        setConnectionStatus("connecting");

        Promise.all([chatConnection.start(), notificationConnection.start(), callConnection.start()])
            .then(() => {

                setConnectionStatus("connected");
                setLoading(false);

                //! ===========  CHAT CONNECTION ===========

                //Initial Group / Individual Chats 
                chatConnection.on("ReceiveInitialChats", (data) => {
                    console.log("GELEN chats DATA:", data)
                    store.dispatch(initializeChats(data));
                });

                chatConnection.on("ReceiveInitialRecipientChatProfiles", (data) => {
                    dispatch(setInitialChatList(data));
                });

                chatConnection.on("ReceiveInitialGroupProfiles", (data) => {
                    dispatch(setGroupList(data));
                });

                chatConnection.on("ReceiveGetMessages", (data) => {
                    if (data.Individual) {
                        Object.entries(data.Individual).forEach(([chatId, messages]) => {
                            Object.entries(messages).forEach(([messageId, messageData]) => {
                                let decryptedContent = messageData.content;
                                if (messageData.type === 0 && decryptedContent && decryptedContent !== "Bu mesaj silindi.") {
                                    decryptedContent = decryptMessage(messageData.content, chatId);
                                }

                                store.dispatch(
                                    addMessageToIndividual({
                                        chatId,
                                        messageId,
                                        messageData: { ...messageData, content: decryptedContent },
                                    })
                                );
                            });
                        });
                    }

                    if (data.Group) {
                        Object.entries(data.Group).forEach(([chatId, messages]) => {
                            Object.entries(messages).forEach(([messageId, messageData]) => {
                                let decryptedContent = messageData.content;

                                // Aynı if koşulu burada uygulanıyor
                                if (messageData.type === 0 && decryptedContent && decryptedContent !== "Bu mesaj silindi.") {
                                    decryptedContent = decryptMessage(messageData.content, chatId);
                                }

                                store.dispatch(
                                    addMessageToGroup({
                                        chatId,
                                        messageId,
                                        messageData: { ...messageData, content: decryptedContent },
                                    })
                                );
                            });
                        });
                    }
                });

                chatConnection.on("ReceiveRecipientProfiles", (data) => {
                    dispatch(addNewUserToChatList(data));
                });

                chatConnection.on("ReceiveCreateChat", (data) => {
                    if (data.Individual) {
                        const individualData = data.Individual;
                        const chatId = Object.keys(individualData)[0];

                        if (chatId) {
                            const chatData = individualData[chatId];
                            dispatch(addNewIndividualChat({ chatId, chatData }));
                        } else {
                            console.error("Chat ID alınamadı:", data);
                        }
                    } else if (data.Group) {
                        const groupData = data.Group;
                        const groupId = Object.keys(groupData)[0];

                        if (groupId) {
                            const groupChatData = groupData[groupId];

                            if (groupChatData.messages && Object.keys(groupChatData.messages).length > 0) {
                                groupChatData.messages = Object.entries(groupChatData.messages)
                                    .map(([messageId, msg]) => {
                                        let decryptedContent = msg.content;
                                        if (msg.type === 0 && decryptedContent && decryptedContent !== "Bu mesaj silindi.") {
                                            decryptedContent = decryptMessage(msg.content, groupId);
                                        }
                                        return {
                                            id: messageId,
                                            ...msg,
                                            content: decryptedContent,
                                            sentDate: new Date(msg.status.sent?.[Object.keys(msg.status.sent)[0]]) // Sent tarihini alıyoruz (görünmeyecek)
                                        };
                                    })
                                    // Sent tarihine göre sıralama yap
                                    .sort((a, b) => a.sentDate - b.sentDate)
                                    .map(({ sentDate, ...msg }) => msg);
                            }

                            dispatch(addNewGroupChat({ chatId: groupId, chatData: groupChatData }));
                        } else {
                            console.error("Group ID alınamadı:", data);
                        }
                    } else {
                        console.error("Bilinmeyen chat türü:", data);
                    }
                });

                chatConnection.on("ReceiveArchiveChat", (data) => {
                    dispatch(addArchive(data));
                });

                chatConnection.on("ReceiveUnarchiveChat", (data) => {
                    dispatch(removeArchive(data));
                });
                chatConnection.on("ReceiveClearChat", (data) => {
                    dispatch(removeIndividualChat(data));
                });

                //! =========== NOTIFICATION CONNECTION ===========

                notificationConnection.on("ReceiveRecipientProfiles", (data) => {
                    console.log("notificationConnection güncelleme verisi : ", data);
                    dispatch(updateUserInfoToChatList(data));
                    dispatch(updateUserInfoToGroupList(data));
                    dispatch(updateCallRecipientList(data));

                });

                notificationConnection.on("ReceiveNewGroupProfiles", (data) => {
                    dispatch(setGroupList(data));
                    console.log("İLK GROUP PROFİE", data);
                    // Gelen data'nın key'ini almak için Object.keys() kullanılıyor
                    const groupId = Object.keys(data)[0];
                    console.log("Group ID:", groupId);

                    if (groupId) {
                        // ChatConnection'un bağlı olduğundan emin olarak işlem yapıyoruz
                        if (chatConnection.state === "Connected") {
                            chatConnection.invoke("CreateChat", "Group", groupId)
                                .then(() => {
                                    console.log(`Grup başarıyla gönderildi: ${groupId}`);
                                })
                                .catch((err) => {
                                    console.error("Grup gönderimi sırasında hata:", err);
                                });
                        } else {
                            console.error("ChatConnection şu anda bağlı değil, işlem gerçekleştirilemedi.");
                            // Bağlantı durumunu beklemek için event-based bir çözüm eklenebilir
                            chatConnection.onclose(() => {
                                console.log("ChatConnection yeniden bağlanıyor...");
                                chatConnection.start()
                                    .then(() => {
                                        console.log("ChatConnection yeniden bağlandı.");
                                        chatConnection.invoke("CreateChat", "Group", groupId)
                                            .then(() => {
                                                console.log(`Grup başarıyla gönderildi: ${groupId}`);
                                            })
                                            .catch((err) => {
                                                console.error("Grup gönderimi sırasında hata:", err);
                                            });
                                    })
                                    .catch((err) => {
                                        console.error("ChatConnection yeniden bağlanırken hata oluştu:", err);
                                    });
                            });
                        }
                    } else {
                        console.error("Grup ID alınamadı.");
                    }
                });

                notificationConnection.on("ReceiveGroupProfiles", (data) => {
                    const groupId = Object.keys(data)[0];  // Gelen veriden grupId'yi alıyoruz
                    const groupData = data[groupId];  // Gelen data içindeki grup bilgilerini alıyoruz

                    // participants içindeki userId'ye bakarak rolünü kontrol et
                    const userParticipant = groupData.participants[userId];
                    console.log("userParticipant", userParticipant);

                    // Eğer rolü 2 ise (atılmışsa) işlemi sonlandırıyoruz
                    if (userParticipant && userParticipant.role === 2) {
                        dispatch(removeGroupChat(groupId));
                        dispatch(removeGroupList(groupId));
                        navigate("/gruplar");
                        return;
                    }

                    // Eğer currentGroupList içinde bu grup varsa, veriyi güncelliyoruz
                    const currentGroupList = store.getState().groupList;
                    if (Object.hasOwn(currentGroupList.groupList, groupId)) {
                        dispatch(updateGroupInformations(data));  // Veriyi güncelliyoruz
                    } else {
                        dispatch(updateGroupInformations(data));  // Veriyi güncelliyoruz
                        chatConnection.invoke("CreateChat", "Group", groupId); // Yeni sohbet oluşturuluyor
                    }
                });



                //! ===========  CALL CONNECTION ===========

                callConnection.on('ReceiveInitialCalls', async (data) => {
                    dispatch(setInitialCalls(data));
                });
                callConnection.on('ReceiveInitialCallRecipientProfiles', async (data) => {
                    dispatch(setCallRecipientList(data));
                });

                callConnection.on('ReceiveIncomingCall', async (data) => {
                    const callType = data.callType;
                    await handleIncomingCall(data, dispatch);
                    initializePeerConnection(callType);
                });

                callConnection.on('ReceiveOutgoingCall', async (data) => {
                    handleOutgoingCall(data, dispatch);
                });

                callConnection.on('ReceiveEndCall', (data) => {
                    handleEndCall(data.call, dispatch);

                    const otherDataKey = Object.keys(data).find(key => key !== 'call');
                    if (otherDataKey) {
                        const otherDataObject = data[otherDataKey];

                        if (otherDataObject) {
                            const formattedData = {
                                [otherDataKey]: {
                                    id: otherDataKey,
                                    ...otherDataObject
                                }
                            };

                            dispatch(updateCallRecipientList(formattedData));
                        }
                    }

                    if (peerConnection.current) {
                        peerConnection.current.getSenders().forEach((sender) => {
                            if (sender.track) {
                                sender.track.stop(); // WebRTC medya akışlarını durdur
                            }
                        });
                        peerConnection.current.close();
                        peerConnection.current = null;
                    }
                });

                callConnection.on('ReceiveDeleteCall', (data) => {
                    dispatch(deleteCallHistory(data));
                });

                callConnection.on('ReceiveIceCandidate', async (data) => {
                    peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
                });

                callConnection.on('ReceiveSdp', async (data) => {
                    try {
                        if (data.type === "offer") {
                            await initializePeerConnection(0);

                            //! if (data.sdp.type === "offer") {
                            //!     await initializePeerConnection(data.callType);

                            console.log("Offer işlemleri başlatılıyor...");
                            await handleRemoteSDP(data, peerConnection.current);
                            const answer = await peerConnection.current.createAnswer();
                            await peerConnection.current.setLocalDescription(answer);

                            await sendSdp(callIdRef.current, answer, callConnection);
                        } else if (data.type === "answer") {
                            await handleRemoteSDP(data, peerConnection.current);
                        } else {
                            console.error("Bilinmeyen SDP türü:", data.type);
                        }
                    } catch (error) {
                        console.error("Remote SDP işlenirken hata:", error);
                    }
                });
            })
            .catch((err) => {
                console.error("Hub bağlantı hatası:", err);
                setConnectionStatus("failed");
                setError(err);
                setLoading(false);
            });

        setChatConnection(chatConnection);
        setNotificationConnection(notificationConnection);
        setCallConnection(callConnection);

        const handleBeforeUnload = () => {
            if (chatConnection) chatConnection.stop();
            if (notificationConnection) notificationConnection.stop();
            if (callConnection) callConnection.stop();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup
        return () => {
            if (chatConnection) chatConnection.stop();
            if (notificationConnection) notificationConnection.stop();
            if (callConnection) callConnection.stop();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (chatConnection && (Individual?.length > 0 || Group?.length > 0)) {
            deliverMessages();
            console.log(location);
        }
    }, [chatConnection, Individual, Group, location]);

    //! ====== METHODS ======

    const handleAcceptCall = async () => {
        try {
            if (peerConnection)
                createAndSendOffer(callIdRef.current, callConnection, peerConnection);

        } catch (error) {
            console.log("Call accept failed:", error);
        }
    };

    const deliverMessages = async () => {
        try {
            const chatIdFromLocation = window.location.pathname.includes("sohbetler") || window.location.pathname.includes("arsivler")
                ? window.location.pathname.split('/')[2]
                : null;
            const groupIdFromLocation = window.location.pathname.includes("gruplar")
                ? window.location.pathname.split('/')[2]
                : null;


            const individualPromises = Individual.flatMap(chat => {
                return chat?.messages
                    .filter(message => {
                        const isSent = message.status.sent && Object.keys(message.status.sent).includes(userId);
                        const isDelivered = message.status.delivered && Object.keys(message.status.delivered).includes(userId);
                        return !(isSent || isDelivered);
                    })
                    .map(message =>
                        chatConnection.invoke("DeliverMessage", "Individual", chat.id, message.id)
                    );
            });

            // Aktif chatId için okuma kontrolü ve işlem (Individual)
            const individualReadPromises = chatIdFromLocation
                ? Individual.flatMap(chat => {
                    if (chat.id === chatIdFromLocation) {
                        return chat.messages
                            .filter(message => {
                                const isRead = message.status.read && Object.keys(message.status.read).includes(userId);
                                const isSentByUser = message.status.sent && Object.keys(message.status.sent).includes(userId);
                                return !isRead && !isSentByUser;
                            })
                            .map(message =>

                                chatConnection.invoke("ReadMessage", "Individual", chat.id, message.id)
                            );
                    }
                    return [];
                })
                : [];


            const groupPromises = Group.flatMap(chat =>
                chat.messages
                    .filter(message => {
                        const isSent = message.status.sent && Object.keys(message.status.sent).includes(userId);
                        const isDelivered = message.status.delivered && Object.keys(message.status.delivered).includes(userId);
                        return !(isSent || isDelivered);
                    })
                    .map(message =>
                        chatConnection.invoke("DeliverMessage", "Group", chat.id, message.id)
                    )
            );

            const groupReadPromises = groupIdFromLocation
                ? Group.flatMap(chat => {
                    if (chat.id === groupIdFromLocation) {
                        return chat.messages
                            .filter(message => {
                                const isRead = message.status.read && Object.keys(message.status.read).includes(userId);
                                const isSentByUser = message.status.sent && Object.keys(message.status.sent).includes(userId);
                                return !isRead && !isSentByUser;
                            })
                            .map(message =>
                                chatConnection.invoke("ReadMessage", "Group", chat.id, message.id)
                            );
                    }
                    return [];
                })
                : [];

            // Tüm mesajları gönder
            await Promise.all([...individualPromises, ...individualReadPromises, ...groupPromises, ...groupReadPromises]);

            console.log("All messages processed successfully.");
        } catch (err) {
            console.error("Error processing messages:", err);
        }
    };

    if (loading) {
        return null;
    }

    return (
        <SignalRContext.Provider
            value={{
                chatConnection, notificationConnection, callConnection, connectionStatus, error, loading,
                setLocalStream,
                setRemoteStream,
                localStream,
                remoteStream,
                peerConnection,
                initializePeerConnection,
                handleAcceptCall
            }}
        >
            {children}
        </SignalRContext.Provider>
    );
};
