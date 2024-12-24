import { createContext, useContext, useState, useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie.js";

// SignalR context oluşturuyoruz
const SignalRContext = createContext();

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    
    // Eğer SignalRProvider içerisinde değilse, hata fırlatıyoruz
    if (!context) {
        throw new Error("useSignalR must be used within a SignalRProvider");
    }

    const { chatConnection, connectionStatus, error, loading } = context;

    // Eğer chatConnection hala null ise, kullanıcıya uyarı verebiliriz
    if (loading) {
        console.warn("Bağlantı yükleniyor...");
    }

    return { chatConnection, connectionStatus, error, loading };
};

export const SignalRProvider = ({ children }) => {
    const [chatConnection, setChatConnection] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Yükleme durumu

    console.log("Bağlantı durumu", connectionStatus);

    useEffect(() => {
    const token = getJwtFromCookie();

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
            console.log("Bağlantı başarılı!");
            setConnectionStatus("connected");
            setLoading(false);
        })
        .catch((err) => {
            console.error("Bağlantı hatası:", err);
            setConnectionStatus("failed");
            setError(err);
            setLoading(false);
        });

    setChatConnection(chatConnection);

    // Tarayıcı sekmesi kapandığında veya site değiştirildiğinde bağlantıyı durdur
    const handleBeforeUnload = () => {
        if (chatConnection) {
            chatConnection.stop();
        }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
        if (chatConnection) {
            chatConnection.stop();
        }
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
}, []);

    console.log("ChatConnection", chatConnection);

    if (loading) {
        return null;
    }

    return (
        <SignalRContext.Provider value={{ chatConnection, connectionStatus, error, loading }}>
            {children}
        </SignalRContext.Provider>
    );
};
