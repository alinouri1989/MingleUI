export const handleRemoteSDP = async (sdp, peerConnection) => {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    } catch (error) {
        console.error("Remote SDP ayarlanamadı:", error);
        throw error;
    }
};

export const addIceCandidate = async (candidate, peerConnection) => {
    if (!peerConnection) {
        console.error("peerConnection undefined bak, ICE Candidate eklenemedi:", candidate);
        return;
    }

    try {
        await peerConnection.current.addIceCandidate(candidate);
    } catch (error) {
        console.error("ICE Candidate eklenemedi:", error);
        throw error;
    }
};

export const sendSdp = async (callId, sdp, callConnection) => {
    try {
        await callConnection.invoke("SendSdp", callId, sdp);
    } catch (error) {
        console.error("SDP gönderilirken hata:", error);
        throw error;
    }
};

export const sendIceCandidate = async (callId, candidate, callConnection) => {
    try {
        await callConnection.invoke("SendIceCandidate", callId, candidate);
    } catch (error) {
        throw error;
    }
};

export const createAndSendOffer = async (callId, callConnection, peerConnection) => {
    try {
        const offer = await peerConnection.current.createOffer();

        // SDP manipülasyonu: Opus codec'i öncelikli hale getir
        const prioritizedOffer = prioritizeOpusCodec(offer);

        await peerConnection.current.setLocalDescription(prioritizedOffer);

        // SDP'yi gönder
        await sendSdp(callId, prioritizedOffer, callConnection);
    } catch (error) {
        console.error("Teklif oluşturulamadı:", error);
        throw error;
    }
};


const prioritizeOpusCodec = (offer) => {
    const sdpLines = offer.sdp.split("\n");
    const opusPayloadType = sdpLines.find((line) => line.includes("opus/48000"))?.match(/:(\d+)/)?.[1];

    if (opusPayloadType) {
        const audioLineIndex = sdpLines.findIndex((line) => line.startsWith("m=audio"));
        if (audioLineIndex !== -1) {
            const audioLine = sdpLines[audioLineIndex];
            const audioLineParts = audioLine.split(" ");

            // Opus payload'u başa taşı
            const updatedAudioLine = [
                audioLineParts[0], // "m=audio"
                audioLineParts[1], // port
                audioLineParts[2], // protocol
                opusPayloadType,   // Opus codec ID
                ...audioLineParts.slice(3).filter((pt) => pt !== opusPayloadType),
            ].join(" ");

            sdpLines[audioLineIndex] = updatedAudioLine;
        }
    } else {
        console.warn("Opus codec bulunamadı. SDP manipülasyonu yapılmadı.");
    }

    offer.sdp = sdpLines.join("\n");
    return offer;
};

