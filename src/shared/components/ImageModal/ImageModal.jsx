import CloseModalButton from "../../../contexts/components/CloseModalButton";
import { FaImages } from "react-icons/fa6";


import "./style.scss";
import { useLocation } from "react-router-dom";
import { encryptMessage } from "../../../helpers/messageCryptoHelper";
import { useSignalR } from "../../../contexts/SignalRContext";

function ImageModal({ image, closeModal, chatId }) {


    const { chatConnection } = useSignalR();
    const location = useLocation();

    const handleSendImage = async () => {
        let chatType = '';
        if (location.pathname.includes('sohbetler') || location.pathname.includes('arsivler')) {
            chatType = 'Individual';
        } else if (location.pathname.includes('gruplar')) {
            chatType = 'Group';
        }

        try {
            // Base64 olarak görüntüyü dönüştür
            const reader = new FileReader();
            reader.readAsDataURL(image); // `image` bir File nesnesi olmalı
            reader.onloadend = async () => {
                const base64Image = reader.result;

                const encryptedMessage = encryptMessage(base64Image, chatId);

                await chatConnection.invoke("SendMessage", chatType, chatId, {
                    ContentType: 1,
                    content: encryptedMessage,
                });
            };
        } catch (error) {
            console.error("Resim gönderme hatası:", error);
        }
    };

    return (
        <div className="image-modal-box">
            <CloseModalButton closeModal={closeModal} />
            <div className="title-box">
                <FaImages />
                <p>Seçilen Resim</p>
            </div>
            <img src={URL.createObjectURL(image)} alt="Uploaded preview" />
            <button onClick={handleSendImage} className="send-image-btn">Gönder</button>
        </div>
    )
}

export default ImageModal