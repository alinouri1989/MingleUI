import { createContext, useContext, useState, useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie.js";
import { useDispatch, useSelector } from "react-redux";
import store from '../store/index.js';
import { addMessageToGroup, addMessageToIndividual, addNewGroupChat, addNewIndividualChat, initializeChats } from "../store/Slices/chats/chatSlice.js";
import { addNewUserToChatList, setInitialChatList, updateUserInfoToChatList } from "../store/Slices/chats/chatListSlice.js";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken.js";
import { setGroupList, updateUserInfoToGroupList } from "../store/Slices/Group/groupListSlice.js";
import { useModal } from "./ModalContext.jsx";
import { useNavigate } from "react-router-dom";
import { handleIncomingCall, handleOutgoingCall } from "../store/Slices/calls/callSlice.js";

// SignalR context oluşturuyoruz
const SignalRContext = createContext();

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    const dispatch = useDispatch(); // Redux dispatch

    if (!context) {
        throw new Error("useSignalR must be used within a SignalRProvider");
    }

    const { chatConnection, notificationConnection, connectionStatus, callConnection, error, loading } = context;

    return { chatConnection, notificationConnection, callConnection, connectionStatus, error, loading };
};

export const SignalRProvider = ({ children }) => {
    const [chatConnection, setChatConnection] = useState(null);
    const [notificationConnection, setNotificationConnection] = useState(null);
    const [callConnection, setCallConnection] = useState(null);

    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const { token } = useSelector(state => state.auth);
    const { Individual, Group } = useSelector(state => state.chat);
    const navigate = useNavigate();
    const userId = getUserIdFromToken(token);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const token = getJwtFromCookie();

        // ChatHub bağlantısını başlat
        const chatConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5069/ChatHub", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        const notificationConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5069/NotificationHub", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        const callConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5069/CallHub", {
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

                console.log("Hub bağlantıları başarılı!");
                setConnectionStatus("connected");
                setLoading(false);

                //! ===========  CHAT CONNECTION ===========

                //Initial Group / Individual Chats 
                chatConnection.on("ReceiveInitialChats", (data) => {
                    store.dispatch(initializeChats(data));
                });

                chatConnection.on("ReceiveInitialGroupProfiles", (data) => {
                    dispatch(setGroupList(data));
                });

                chatConnection.on("ReceiveGetMessages", (data) => {
                    if (data.Individual) {
                        Object.entries(data.Individual).forEach(([chatId, messages]) => {
                            Object.entries(messages).forEach(([messageId, messageData]) => {
                                store.dispatch(
                                    addMessageToIndividual({
                                        chatId,
                                        messageId,
                                        messageData,
                                    })
                                );
                            });
                        });
                    }
                    if (data.Group) {
                        Object.entries(data.Group).forEach(([chatId, messages]) => {
                            Object.entries(messages).forEach(([messageId, messageData]) => {
                                store.dispatch(
                                    addMessageToGroup({
                                        chatId,
                                        messageId,
                                        messageData,
                                    })
                                );
                            });
                        });
                    }
                });

                chatConnection.on("Error", (data) => {
                    console.log("HATA : ", data)
                });

                chatConnection.on("ReceiveInitialRecipientChatProfiles", (data) => {
                    dispatch(setInitialChatList(data));
                });

                chatConnection.on("ReceiveRecipientProfiles", (data) => {
                    dispatch(addNewUserToChatList(data));
                });

                chatConnection.on("ReceiveCreateChat", (data) => {
                    console.log("Yeni grup chat oluşturuldu:", data);
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
                        console.log("Buraya giriyor mu");
                        const groupData = data.Group;
                        const groupId = Object.keys(groupData)[0];

                        if (groupId) {
                            const groupChatData = groupData[groupId];
                            dispatch(addNewGroupChat({ chatId: groupId, chatData: groupChatData }));
                        } else {
                            console.error("Group ID alınamadı:", data);
                        }
                    } else {
                        console.error("Bilinmeyen chat türü:", data);
                    }
                });

                //! =========== NOTIFICATION CONNECTION ===========

                notificationConnection.on("ReceiveRecipientProfiles", (data) => {
                    console.log("notificationConnection güncelleme verisi : ", data);
                    dispatch(updateUserInfoToChatList(data));
                    dispatch(updateUserInfoToGroupList(data));

                });

                notificationConnection.on("ReceiveNewGroupProfiles", (data) => {
                    console.log("NotificationHub'dan gelen grup profilleri:", data);

                    dispatch(setGroupList(data));
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
                    console.log("NotificationHub'dan gelen grup profilleri:", data);

                }); // Grup profilleri güncellendiğinde, yapılacak işlem

                //! =========== CALL CONNECTION ===========

                // Arama bağlantısındaki dinleyiciler
                callConnection.on('ReceiveIncomingCall', (data) => {
                    console.log(data);
                    handleIncomingCall(data, dispatch);
                });

                callConnection.on('ReceiveOutgoingCall', (data) => {
                    console.log(data);
                    handleOutgoingCall(data, dispatch);
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
        }
    }, [chatConnection, Individual, Group, window.location.pathname]);

    //! ====== METHODS ======

    const deliverMessages = async () => {
        try {
            // Location'dan aktif chatId ve groupId al
            const chatIdFromLocation = window.location.pathname.includes("sohbetler")
                ? window.location.pathname.split('/')[2]
                : null;
            const groupIdFromLocation = window.location.pathname.includes("gruplar")
                ? window.location.pathname.split('/')[2]
                : null;

            // Individual mesajlarını filtrele ve gönder
            const individualPromises = Individual.flatMap(chat => {
                return chat.messages
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


            // Group mesajlarını filtrele ve gönder
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

            // Aktif groupId için okuma kontrolü ve işlem (Group)
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
            value={{ chatConnection, notificationConnection, callConnection, connectionStatus, error, loading }}
        >
            {children}
        </SignalRContext.Provider>
    );
};
