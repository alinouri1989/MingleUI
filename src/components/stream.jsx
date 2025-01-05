import React, { useRef, useEffect } from "react";
import { useSignalR } from "../contexts/SignalRContext";

function Stream() {
    const { localStream, remoteStream } = useSignalR();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        // Yerel yayını video elementine bağlama
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        // Uzak yayını video elementine bağlama
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="deneme-stream">
            <h2>Yerel Yayın</h2>
            <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{ width: "300px", border: "1px solid black" }}
            />
            <h2>Uzak Yayın</h2>
            <video
                ref={remoteVideoRef}
                autoPlay
                style={{ width: "300px", border: "1px solid black" }}
            />
        </div>
    );
}

export default Stream;
