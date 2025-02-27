import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import MingleAI from "../../../assets/logos/MingleAI.webp";
import ImageGeneratorBanner from "../../../assets/images/AIModal/ImageGeneratorBanner.webp";
import TextGeneratorBanner from "../../../assets/images/AIModal/TextGeneratorBanner.webp";

import { SuccessAlert } from "../../../helpers/customAlert"

import "./style.scss";

import { IoClose } from "react-icons/io5";
import { TbFileText } from "react-icons/tb";
import { BiImage } from "react-icons/bi";
import { HiArrowSmUp } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";
import { LuDownload } from "react-icons/lu";

export const AIModal = ({ isOpen, onClose, buttonRef }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isContent, setIsContent] = useState(false);
    const [maxHeight, setMaxHeight] = useState("300px");

    const modalRef = useRef(null);

    const [isTextGeneratorMode, setIsTextGeneratorMode] = useState(true);
    const [prompt, setPrompt] = useState("");

    // Konumu hesaplayan fonksiyon
    const updatePosition = () => {
        if (buttonRef.current && modalRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const modalRect = modalRef.current.getBoundingClientRect();

            // Ekran genişliğini kontrol et
            if (window.innerWidth < 430) { // Mobil ekran için eşik
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
            setIsContent(false);

            // 1.5 saniye sonra içeriği göster
            const timer = setTimeout(() => {
                setIsContent(true); // İçeriği göster
            }, 1500); // 1.5 saniye sonra içerik görünsün

            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition);
            window.addEventListener("click", handleOutsideClick);

            return () => {
                clearTimeout(timer); // Temizle
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition);
                window.removeEventListener("click", handleOutsideClick);
            };
        }
    }, [isOpen]);

    const handleOutsideClick = (event) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target) &&
            !event.target.closest(".send-prompt-btn")
        ) {
            onClose();
        }
    };

    const handleSendPrompt = () => {
        SuccessAlert("Loading...");
        setPrompt("");
        setIsContent(false);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendPrompt();
        }
    };

    const updateHeight = () => {
        if (window.innerWidth <= 430) {
            setMaxHeight(`${window.innerHeight * 0.75}px`); // %80 ekran yüksekliği
        } else {
            setMaxHeight("300px"); // Varsayılan max-height
        }
    };

    useEffect(() => {
        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

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
                                {/* <div className="banner">
                                    <img src={isTextGeneratorMode ? TextGeneratorBanner : ImageGeneratorBanner} alt="" />
                                </div> */}

                                {isTextGeneratorMode ?
                                    <div style={{
                                        maxHeight: maxHeight,
                                        overflowY: "auto",
                                    }} className="text-generator-result">
                                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing eli. Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim nihil nam, deserunt deleniti asperiores ex impedit assumenda. Quae doloribus quos deleniti praesentium quam, omnis ratione expedita pariatur repellat non numquam at itaque vitae suscipit maxime nisi. Laborum, iste rem? Necessitatibus repellat dolore ea impedit nostrum reprehenderit. Dignissimos, nulla? Officiis consequatur debitis deleniti animi. Nulla nisi harum earum pariatur vitae sapiente quo sequi ipsum ex, quidem non quasi a error quisquam voluptas dolorem laboriosam magni nostrum odit id, similique autem debitis consequuntur? Consequuntur minus harum esse in, totam voluptate placeat consequatur aliquid labore? Doloremque nam nemo quasi aspernatur adipisci quas nobis!</p>

                                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing eli. Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim nihil nam, deserunt deleniti asperiores ex impedit assumenda. Quae doloribus quos deleniti praesentium quam, omnis ratione expedita pariatur repellat non numquam at itaque vitae suscipit maxime nisi. Laborum, iste rem? Necessitatibus repellat dolore ea impedit nostrum reprehenderit. Dignissimos, nulla? Officiis consequatur debitis deleniti animi. Nulla nisi harum earum pariatur vitae sapiente quo sequi ipsum ex, quidem non quasi a error quisquam voluptas dolorem laboriosam magni nostrum odit id, similique autem debitis consequuntur? Consequuntur minus harum esse in, totam voluptate placeat consequatur aliquid labore? Doloremque nam nemo quasi aspernatur adipisci quas nobis!</p>
                                    </div> :

                                    <div className="image-generator-result">
                                        <div>örnek resim</div>
                                    </div>
                                }
                            </div>

                            <div className="options-box">
                                {/* <div className="input-box">
                                    <input
                                        placeholder="Bir istemde bulunun"
                                        type="text"
                                        onKeyDown={handleKeyDown}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                    <button className="send-prompt-btn" onClick={handleSendPrompt}>
                                        <HiArrowSmUp />
                                    </button>
                                </div> */}
                                <div className="result-options-box">
                                    <div className="buttons">
                                        <button><MdDelete /></button>
                                        <button><MdRefresh /></button>
                                        <button><AiFillLike /></button>
                                        {isTextGeneratorMode
                                            ? <button><MdContentCopy /></button>
                                            : <button><LuDownload /></button>
                                        }
                                    </div>
                                    <button className="send-message-btn">
                                        Gönder
                                    </button>
                                </div>
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
