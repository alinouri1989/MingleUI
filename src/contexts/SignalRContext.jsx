import { createContext, useContext, useState, useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie.js";
import { useDispatch } from "react-redux";
import store from '../store/index.js';
import { addMessageToGroup, addMessageToIndividual, initializeChats } from "../store/Slices/chats/chatSlice.js";
import { setInitialChatList, updateChatUserProperty } from "../store/Slices/chats/chatListSlice.js";

// SignalR context oluşturuyoruz
const SignalRContext = createContext();

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    const dispatch = useDispatch(); // Redux dispatch

    // Eğer SignalRProvider içerisinde değilse, hata fırlatıyoruz
    if (!context) {
        throw new Error("useSignalR must be used within a SignalRProvider");
    }

    const { chatConnection, connectionStatus, error, loading } = context;

    return { chatConnection, connectionStatus, error, loading };
};

export const SignalRProvider = ({ children }) => {
    const [chatConnection, setChatConnection] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
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

        setConnectionStatus("connecting");

        chatConnection
            .start()
            .then(() => {
                console.log("ChatHub bağlantısı başarılı!");
                setConnectionStatus("connected");
                setLoading(false);

                chatConnection.on("ReceiveInitialChats", (data) => {
                    console.log("Gelen sohbetler:", data);
                    store.dispatch(initializeChats(data));
                });

                chatConnection.on("ReceiveGetMessages", (data) => {
                    console.log("Gelen mesajlar:", data);
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

                chatConnection.on("ReceiveInitialGroupProfiles", (data) => {

                });

                chatConnection.on("ReceiveInitialRecipientProfiles", (data) => {
                    dispatch(setInitialChatList(data));
                });

                chatConnection.on("ReceiveRecipientProfiles", (data) => {
                    dispatch(updateChatUserProperty(data));
                });

                chatConnection.on("ReceiveCreateChat", (data) => {
                    console.log(data);
                });

            })
            .catch((err) => {
                console.error("ChatHub bağlantı hatası:", err);
                setConnectionStatus("failed");
                setError(err);
                setLoading(false);
            });

        setChatConnection(chatConnection);

        const handleBeforeUnload = () => {
            if (chatConnection) chatConnection.stop();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup
        return () => {
            if (chatConnection) chatConnection.stop();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    if (loading) {
        return null;
    }


    return (
        <SignalRContext.Provider
            value={{ chatConnection, connectionStatus, error, loading }}
        >
            {children}
        </SignalRContext.Provider>
    );
};
