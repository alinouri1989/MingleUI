import { setIsCallStarting } from "../store/Slices/calls/callSlice";
import { ErrorAlert } from "./customAlert";

export const startCall = async (callConnection, recipientId, isCameraCall, dispatch, openModalCallback) => {
    if (!callConnection || !recipientId) return;

    let isCallBlocked = false; // Meşgul olup olmadığını takip eden flag

    try {
        // ValidationError event'ini dinleyerek flag'i güncelliyoruz
        const handler = (data) => {
            ErrorAlert(data.message);
            isCallBlocked = true; // Çağrı meşgul
        };
        callConnection.on("ValidationError", handler);

        // Çağrıyı başlat
        await callConnection.invoke("StartCall", recipientId, isCameraCall ? 1 : 0);

        // Kısa bir süre bekleyerek ValidationError olup olmadığını kontrol ediyoruz
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Event listener'ı kaldır
        callConnection.off("ValidationError", handler);

        // Eğer kullanıcı meşgulse, çağrıyı başlatmayacağız
        if (!isCallBlocked) {
            dispatch(setIsCallStarting(true));
            openModalCallback();
        }
    } catch {
        ErrorAlert("Bir hata meydana geldi");
    }
};
