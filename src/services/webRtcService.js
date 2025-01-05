let localStream = null;
let remoteStream = null;



export const startLocalStream = async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        return localStream;
    } catch (error) {
        console.error("Yerel medya akışı başlatılamadı:", error);
        throw error;
    }
};

// export const createOffer = async () => {
//     try {
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
//         console.log("Teklif oluşturuldu:", offer);
//         return offer;
//     } catch (error) {
//         console.error("Teklif oluşturulamadı:", error);
//         throw error;
//     }
// };

export const handleRemoteSDP = async (sdp, peerConnection) => {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("Remote SDP ayarlandı:", sdp);
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
        console.log("ICE Candidate eklendi:", candidate);
    } catch (error) {
        console.error("ICE Candidate eklenemedi:", error);
        throw error;
    }
};

export const sendSdp = async (callId, sdp, callConnection) => {
    try {
        await callConnection.invoke("SendSdp", callId, sdp);
        console.log("SDP gönderildi:", sdp);
    } catch (error) {
        console.error("SDP gönderilirken hata:", error);
        throw error;
    }
};

export const sendIceCandidate = async (callId, candidate, callConnection) => {
    try {
        await callConnection.invoke("SendIceCandidate", callId, candidate);
        console.log("ICE Candidate gönderildi:", candidate);
    } catch (error) {
        console.error("ICE Candidate gönderilirken hata:", error);
        throw error;
    }
};

export const createAndSendOffer = async (callId, callConnection, peerConnection) => {
    try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        console.log("Teklif oluşturuldu ve yerel ayarlandı:", offer);

        // SignalR üzerinden gönder
        await sendSdp(callId, offer, callConnection);
    } catch (error) {
        console.error("Teklif oluşturulamadı:", error);
        throw error;
    }
};

// export const createAndSendAnswer = async (callId, callConnection) => {
//     try {
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
//         console.log("Cevap oluşturuldu ve yerel ayarlandı:", answer);

//         // SignalR üzerinden gönder
//         await sendSdp(callId, answer, callConnection);
//     } catch (error) {
//         console.error("Cevap oluşturulamadı:", error);
//         throw error;
//     }
// };
