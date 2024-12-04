import CloseModalButton from "../../../contexts/components/CloseModalButton";
import { FaImages } from "react-icons/fa6";


import "./style.scss";

function ImageModal({ image, closeModal }) {

    const handleSendImage = () => {
        //Implementation of sending photos 
        //! receiverId is required.
        closeModal();
    }
    console.log(image);
    return (
        <div className="image-modal-box">
            <CloseModalButton closeModal={closeModal} />
            <div className="title-box">
                <FaImages />
                <p>Seçilen Resim</p>
            </div>
            <img src={image} />
            <button onClick={handleSendImage} className="send-image-btn">Gönder</button>
        </div>
    )
}

export default ImageModal