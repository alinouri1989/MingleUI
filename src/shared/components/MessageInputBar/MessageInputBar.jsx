import React, { useEffect, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

import "./style.scss";
import { useModal } from "../../../contexts/ModalContext";
import ImageModal from "../ImageModal/ImageModal";
import { useSignalR } from "../../../contexts/SignalRContext";

function MessageInputBar({ chatId }) {
    const { messageConnection } = useSignalR(); // SignalR bağlantısını al

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { showModal, closeModal } = useModal();
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const emojiPickerRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };


    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };


    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            console.log(file);

            showModal(<ImageModal closeModal={closeModal} image={URL.createObjectURL(file)} />);
        }
    };

    const handleSendMessage = async () => {
        if (!message && !selectedFile) {
            console.error("Boş bir mesaj gönderilemez.");
            return;
        }

        // ContentType'ı belirleme
        let contentType;
        if (message) {
            contentType = 0; // Text
        } else if (selectedFile) {
            contentType = 4; // File
        }

        // DTO'yu oluşturma
        const sendMessageDto = {
            ContentType: contentType,
            TextContent: message || null,
            FileContent: selectedFile ? await selectedFile.arrayBuffer() : null,
        };

        try {

            await messageConnection.invoke("SendMessage", chatId, sendMessageDto);
            setMessage("");
            setSelectedFile(null);
            console.log("Mesaj başarıyla gönderildi.");
        } catch (error) {
            console.error("Mesaj gönderme hatası:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="message-input-bar">
            <div className="input-box">
                <div className="add-file-box">
                    <button className="add-file-button" onClick={handleFileSelect}>
                        <HiPlus />
                    </button>

                    <input
                        type="file"
                        accept="image/png"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>

                <input
                    type="text"
                    placeholder="Bir mesaj yazın"
                    value={message}
                    onChange={handleInputChange}
                />

                <div className="emoji-and-send-buttons">
                    <button className="add-emoji-button" onClick={toggleEmojiPicker}>
                        <MdOutlineEmojiEmotions />
                    </button>
                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="emoji-picker">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    <button onClick={handleSendMessage} className="send-message-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 27 27" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.82724 7.50691C3.53474 4.88116 6.23812 2.95291 8.62649 4.08466L22.0635 10.4499C24.6375 11.6683 24.6375 15.3313 22.0635 16.5497L8.62649 22.916C6.23812 24.0478 3.53587 22.1195 3.82724 19.4938L4.36724 14.6248H13.5C13.7984 14.6248 14.0845 14.5063 14.2955 14.2953C14.5065 14.0843 14.625 13.7982 14.625 13.4998C14.625 13.2014 14.5065 12.9153 14.2955 12.7043C14.0845 12.4933 13.7984 12.3748 13.5 12.3748H4.36837L3.82724 7.50691Z"
                                fill="white"
                            />
                        </svg>
                    </button>
                </div>
            </div>

        </div>
    );
}

export default MessageInputBar;
