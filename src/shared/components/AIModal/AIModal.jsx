import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import MingleAI from "../../../assets/logos/MingleAI.png";
import "./style.scss";

export const AIModal = ({ isOpen, onClose, buttonRef }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isContent, setIsContent] = useState(false); // İçeriğin gösterilip gösterilmeyeceğini kontrol eden state
    const modalRef = useRef(null);

    // Konumu hesaplayan fonksiyon
    const updatePosition = () => {
        if (buttonRef.current && modalRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const modalRect = modalRef.current.getBoundingClientRect();

            setPosition({
                top: rect.top - modalRect.height - 38, // Üstüne hizalama
                left: rect.left - modalRect.width * 0.7, // Daha sola hizalama
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition(); // İlk açıldığında konumu hesapla
            setIsContent(false); // Modal açıldığında içeriği gizle

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

    // Modal dışına tıklayınca kapatma fonksiyonu
    const handleOutsideClick = (event) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target) && // Modal dışında bir yere tıklandı mı?
            buttonRef.current &&
            !buttonRef.current.contains(event.target) // Butona tıklanmadı mı?
        ) {
            onClose(); // Modalı kapat
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
                            <p>Bu bir modal!</p>
                            <button onClick={onClose}>Kapat</button>
                        </motion.div>
                    )
                        :
                        <div className="intro-box">
                            <img src={MingleAI} alt="mingle" />
                        </div>

                    }
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
