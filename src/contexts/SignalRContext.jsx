import { createContext, useContext, useState, useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie.js";
import { useDispatch } from "react-redux";
import store from '../store/index.js';
import { addMessageToGroup, addMessageToIndividual, initializeChats } from "../store/Slices/chats/chatSlice.js";

// SignalR context oluşturuyoruz
const SignalRContext = createContext();

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    const dispatch = useDispatch(); // Redux dispatch

    // Eğer SignalRProvider içerisinde değilse, hata fırlatıyoruz
    if (!context) {
        throw new Error("useSignalR must be used within a SignalRProvider");
    }

    const { chatConnection, messageConnection, connectionStatus, error, loading } = context;

    return { chatConnection, messageConnection, connectionStatus, error, loading };
};

export const SignalRProvider = ({ children }) => {
    const [chatConnection, setChatConnection] = useState(null);
    const [messageConnection, setMessageConnection] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState({
        chat: "disconnected",
        message: "disconnected",
    });
    const [error, setError] = useState({ chat: null, message: null });
    const [loading, setLoading] = useState({ chat: true, message: true });

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

        setConnectionStatus((prev) => ({ ...prev, chat: "connecting" }));

        chatConnection
            .start()
            .then(() => {
                console.log("ChatHub bağlantısı başarılı!");
                setConnectionStatus((prev) => ({ ...prev, chat: "connected" }));
                setLoading((prev) => ({ ...prev, chat: false }));

                chatConnection.on("ReceiveInitialChats", (data) => {
                    console.log("Gelen sohbetler:", data);
                    store.dispatch(initializeChats(data)); 
                });

            })
            .catch((err) => {
                console.error("ChatHub bağlantı hatası:", err);
                setConnectionStatus((prev) => ({ ...prev, chat: "failed" }));
                setError((prev) => ({ ...prev, chat: err }));
                setLoading((prev) => ({ ...prev, chat: false }));
            });

        setChatConnection(chatConnection);

        const messageConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5069/MessageHub", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        setConnectionStatus((prev) => ({ ...prev, message: "connecting" }));

        chatConnection.onclose((error) => {
            console.error("ChatHub connection closed", error);
            setConnectionStatus((prev) => ({ ...prev, chat: "disconnected" }));
            setError((prev) => ({ ...prev, chat: error }));
        });

        messageConnection
        .start()
        .then(() => {
            console.log("MessageHub bağlantısı başarılı!");
            setConnectionStatus((prev) => ({ ...prev, message: "connected" }));
            setLoading((prev) => ({ ...prev, message: false }));
    
            // ReceiveGetMessages olayını dinle
            messageConnection.on("ReceiveGetMessages", (data) => {
                // Individual mesajları işle
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
            
                // Group mesajları işle
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
        })
        .catch((err) => {
            console.error("MessageHub bağlantı hatası:", err);
            setConnectionStatus((prev) => ({ ...prev, message: "failed" }));
            setError((prev) => ({ ...prev, message: err }));
            setLoading((prev) => ({ ...prev, message: false }));
        });

        setMessageConnection(messageConnection);

        const handleBeforeUnload = () => {
            if (chatConnection) chatConnection.stop();
            if (messageConnection) messageConnection.stop();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
   
        // Cleanup
        return () => {
            if (chatConnection) chatConnection.stop();
            if (messageConnection) messageConnection.stop();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    if (loading.chat || loading.message) {
        return null;
    }

    return (
        <SignalRContext.Provider
            value={{ chatConnection, messageConnection, connectionStatus, error, loading }}
        >
            {children}
        </SignalRContext.Provider>
    );
};
