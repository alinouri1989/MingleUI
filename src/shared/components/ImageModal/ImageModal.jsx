import CloseModalButton from "../../../contexts/components/CloseModalButton";
import { FaImages } from "react-icons/fa6";
import { useState } from "react"; // useState importu
import "./style.scss";
import { useLocation } from "react-router-dom";
import { useSignalR } from "../../../contexts/SignalRContext";
import PreLoader from "../PreLoader/PreLoader";


function ImageModal({ image, closeModal, chatId }) {
    const { chatConnection } = useSignalR();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false); // isLoading durumu

    const handleSendImage = async () => {
        let chatType = '';
        if (location.pathname.includes('sohbetler') || location.pathname.includes('arsivler')) {
            chatType = 'Individual';
        } else if (location.pathname.includes('gruplar')) {
            chatType = 'Group';
        }

        try {
            setIsLoading(true); // Yükleme durumunu başlat

            // Base64 olarak görüntüyü dönüştür
            const reader = new FileReader();
            reader.readAsDataURL(image); // `image` bir File nesnesi olmalı
            reader.onloadend = async () => {
                const base64Image = reader.result;
                const base64String = base64Image.split(',')[1];

                await chatConnection.invoke("SendMessage", chatType, chatId, {
                    ContentType: 1,
                    content: base64String,
                });

                setIsLoading(false); // Yükleme işlemi tamamlandı, isLoading'i false yap
                closeModal();
            };
        } catch (error) {
            console.error("Resim gönderme hatası:", error);
            setIsLoading(false); // Hata durumunda da isLoading'i false yap
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

            {isLoading && <PreLoader />} {/* Yükleme durumu göster */}
        </div>
    );
}

export default ImageModal;