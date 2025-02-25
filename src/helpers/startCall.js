import { setIsCallStarting } from "../store/Slices/calls/callSlice";
import { ErrorAlert } from "./customAlert";

export const startCall = async (callConnection, recipientId, isCameraCall, dispatch, openModalCallback) => {
    if (!callConnection || !recipientId) return;
    try {
        await callConnection.invoke("StartCall", recipientId, isCameraCall ? 1 : 0);
        dispatch(setIsCallStarting(true));
        openModalCallback();
    } catch {
        ErrorAlert("Bir hata meydana geldi");
    }
};
