import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";

import MingleAI from "../../../assets/logos/MingleAI.webp";
import ImageGeneratorBanner from "../../../assets/images/AIModal/ImageGeneratorBanner.webp";
import TextGeneratorBanner from "../../../assets/images/AIModal/TextGeneratorBanner.webp";

import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert"
import { downloadImageFromBase64 } from "../../../helpers/downloadImageFromBase64.js";
import { convertBase64ToImage } from "../../../store/helpers/convertBase64ToImage.js"

import { IoClose } from "react-icons/io5";
import { TbFileText } from "react-icons/tb";
import { BiImage } from "react-icons/bi";
import { HiArrowSmUp } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";
import { LuDownload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";

import { useGeminiTextMutation, useFluxImageMutation } from "../../../store/Slices/mingleAi/MingleAiApi";

import "./style.scss";
import { encryptMessage } from "../../../helpers/messageCryptoHelper.js";
import { useSignalR } from "../../../contexts/SignalRContext.jsx";

export const AIModal = ({ chatId, isOpen, onClose, buttonRef }) => {

    const [geminiText, { }] = useGeminiTextMutation();
    const [fluxImage, { }] = useFluxImageMutation();
    const { chatConnection } = useSignalR();

    const [isTextGeneratorMode, setIsTextGeneratorMode] = useState(true);
    const [textPrompt, setTextPrompt] = useState("");
    const [imagePrompt, setImagePrompt] = useState("");

    const [responseText, setResponseText] = useState("");
    const [responseImage, setResponseImage] = useState("");

    const [textError, setTextError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const [isTextLiked, setIsTextLiked] = useState(false);
    const [isImageLiked, setIsImageLiked] = useState(false);
    const [isTextCopied, setIsTextCopied] = useState(false);

    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isContent, setIsContent] = useState(true);
    const [maxHeight, setMaxHeight] = useState("300px");
    const modalRef = useRef(null);

    const updatePosition = () => {
        if (buttonRef.current && modalRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const modalRect = modalRef.current.getBoundingClientRect();

            if (window.innerWidth < 430) {
                setPosition({
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                });
            } else {
                setPosition({
                    top: rect.top - modalRect.height - 38,
                    left: rect.left - modalRect.width * 0.7,
                    width: "auto",
                    height: "auto",
                });
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();

            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition);
            window.addEventListener("click", handleOutsideClick);

            return () => {
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition);
                window.removeEventListener("click", handleOutsideClick);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    const handleOutsideClick = (event) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target) &&
            !event.target.closest(".send-prompt-btn") &&
            !event.target.closest(".delete-response") &&
            !event.target.closest(".refresh-response") &&
            !event.target.closest(".copy-text") &&
            !event.target.closest(".copy-icons")
        ) {
            onClose();
        }
    };

    const handleDeleteResponse = () => {
        if (isTextGeneratorMode) {
            if (textPrompt) {
                setResponseText("");
                setTextPrompt("");
                setIsTextLiked(false);
            }
        }
        else {
            if (imagePrompt) {
                setResponseImage("");
                setImagePrompt("");
                setIsImageLiked(false);
            }
        }
    }

    const handleCopyText = () => {
        if (!responseText) return;

        const tempElement = document.createElement("div");
        tempElement.innerHTML = responseText;

        const plainText = tempElement.innerText || tempElement.textContent;

        // Panoya kopyala
        navigator.clipboard.writeText(plainText)
            .then(() => {
                setIsTextCopied(true);
                SuccessAlert("Metin panoya kopyalandı");
                setTimeout(() => setIsTextCopied(false), 2000);
            })
            .catch(err => {
                ErrorAlert("Metin kopyalanırken bir hata oluştu");
            });
    };

    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const extractBase64 = (dataUrl) => dataUrl.split(",")[1] || "";

    const getChatType = (pathname) => {
        if (pathname.includes('sohbetler') || pathname.includes('arsivler')) return 'Individual';
        if (pathname.includes('gruplar')) return 'Group';
        return '';
    };

    const sendMessage = async (contentType, content) => {
        try {
            await chatConnection.invoke("SendMessage", getChatType(location.pathname), chatId, { ContentType: contentType, Content: content });
            onClose();
        } catch (error) {
            ErrorAlert("Mesaj gönderilirken bir hata oluştu");
            console.error(error);
        }
    };

    const handleSendMessage = async () => {
        if (isTextGeneratorMode) {
            if (!textPrompt) return;
            const textContent = stripHtmlTags(responseText);
            const encryptedMessage = encryptMessage(textContent, chatId);
            await sendMessage(0, encryptedMessage);
        } else {
            if (!responseImage) return;
            await sendMessage(1, extractBase64(responseImage));
        }
    };

    const handleSendPrompt = async () => {

        setIsTextLiked(false);
        setIsImageLiked(false);
        setIsContent(false);
        setTextError(false);
        setImageError(false);

        if (isTextGeneratorMode) {
            try {
                const data = await geminiText(textPrompt).unwrap();
                const markdownToHtml = (markdown) => marked(data.responseText);
                setResponseText(markdownToHtml);
                setIsContent(true);
            } catch (error) {
                setTextError(true);
                setIsContent(true);
            }
        } else {
            try {
                const data = await fluxImage(imagePrompt).unwrap();
                setResponseImage(convertBase64ToImage(data.responseImage));
                setIsContent(true);
            } catch (error) {
                setImageError(true);
                setIsContent(true);
            }
        }
    };

    const handleDownloadImage = () => {
        const base64Image = responseImage;
        downloadImageFromBase64(base64Image, 'MingleImage.png');
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendPrompt();
        }
    };

    const updateHeight = () => {
        if (window.innerWidth <= 430) {
            setMaxHeight(`${window.innerHeight * 0.75}px`);
        } else {
            setMaxHeight("300px");
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={modalRef}
                    className="ai-modal"
                    style={{
                        position: "absolute",
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    }}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{
                        duration: 0.25,
                        ease: "easeOut",
                    }}
                >
                    {isContent ? (
                        <motion.div
                            className="content-box"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1.2 }}
                            transition={{ duration: 1.2 }}
                        >
                            <div className="navigation-box">
                                <img src={MingleAI} alt="" />
                                <button onClick={() => setIsTextGeneratorMode(true)} className={`text-generate-btn ${isTextGeneratorMode ? "active" : ""}`}>
                                    <TbFileText />
                                    <span>Metin</span>
                                </button>

                                <button
                                    onClick={() => setIsTextGeneratorMode(false)}
                                    className={`image-generate-btn ${!isTextGeneratorMode ? "active" : ""}`}>
                                    <BiImage />
                                    <span>Resim</span>
                                </button>

                                <button onClick={() => onClose()} className="close-btn"><IoClose /></button>
                            </div>

                            <div className="result-box">
                                {isTextGeneratorMode
                                    ?
                                    responseText ?
                                        <div style={{ maxHeight: maxHeight, overflowY: "auto" }}
                                            dangerouslySetInnerHTML={{ __html: responseText }}
                                            className="text-generator-result">
                                        </div>
                                        :
                                        <div className="banner">
                                            <img src={TextGeneratorBanner} alt="text-generator-banner" />
                                            {textError && <span>Bir hata meydana geldi. Tekrar Deneyin.</span>}
                                        </div>

                                    :
                                    responseImage ?
                                        <div className="image-generator-result">
                                            <img src={responseImage} alt="" />
                                        </div>

                                        :
                                        <div className="banner">
                                            <img src={ImageGeneratorBanner} alt="text-generator-banner" />
                                            {imageError && <span>Bir hata meydana geldi. Tekrar Deneyin.</span>}
                                        </div>
                                }
                            </div>

                            <div className="options-box">
                                {isTextGeneratorMode ? (
                                    responseText ? (
                                        <div className="result-options-box">
                                            <div className="buttons">
                                                <button className="delete-response" onClick={handleDeleteResponse}><MdDelete /></button>
                                                <button className="refresh-response" onClick={handleSendPrompt}><MdRefresh /></button>
                                                <button className={`like-response ${isTextLiked ? "liked" : ""}`} onClick={() => setIsTextLiked(!isTextLiked)}><AiFillLike /></button>
                                                <button className="copy-text" onClick={handleCopyText}>
                                                    {isTextCopied ? <FaCheck className="copy-icons" /> : <MdContentCopy className="copy-icons" />}
                                                </button>
                                            </div>
                                            <button onClick={handleSendMessage} className="send-message-btn">
                                                Gönder
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="input-box">
                                            <input
                                                placeholder="Bir istemde bulunun"
                                                type="text"
                                                onKeyDown={handleKeyDown}
                                                value={textPrompt}
                                                onChange={(e) => setTextPrompt(e.target.value)}
                                            />
                                            <button className="send-prompt-btn" onClick={handleSendPrompt}>
                                                <HiArrowSmUp />
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    responseImage ? (
                                        <div className="result-options-box">
                                            <div className="buttons">
                                                <button className="delete-response" onClick={handleDeleteResponse}><MdDelete /></button>
                                                <button className="refresh-response" onClick={handleSendPrompt}><MdRefresh /></button>
                                                <button className={`like-response ${isImageLiked ? "liked" : ""}`} onClick={() => setIsImageLiked(!isImageLiked)}><AiFillLike /></button>
                                                <button className="download-image" onClick={handleDownloadImage}><LuDownload /></button>
                                            </div>
                                            <button onClick={handleSendMessage} className="send-message-btn">
                                                Gönder
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="input-box">
                                            <input
                                                placeholder="Bir istemde bulunun"
                                                type="text"
                                                onKeyDown={handleKeyDown}
                                                value={imagePrompt}
                                                onChange={(e) => setImagePrompt(e.target.value)}
                                            />
                                            <button className="send-prompt-btn" onClick={handleSendPrompt}>
                                                <HiArrowSmUp />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    )
                        :
                        <div className="intro-box">
                            <img src={MingleAI} alt="mingle" />
                        </div>

                    }
                </motion.div>
            )
            }
        </AnimatePresence >,
        document.body
    );
};
