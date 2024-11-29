import React, { useEffect, useState, useRef } from 'react';
import MingleLogo from "../../../assets/logos/MingleLogoWithText.svg";

import { MdScreenShare } from "react-icons/md";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { TbMicrophoneFilled } from "react-icons/tb";
import { TbMicrophoneOff } from "react-icons/tb";
import { PiPhoneSlashFill } from "react-icons/pi";

import CallSound from "../../../assets/Sounds/MingleCallSound.mp3";
import "./CallModal.scss";

function CallModal({ closeModal, user }) {
    const userName = "Okan Doğan";
    const callStatus = "Aranıyor...";
    const [isMicrophoneOn, setMicrophoneMode] = useState(true);
    const [isSpeakerOn, setSpeakerMode] = useState(true);
    const audioRef = useRef(null);
    const userImage = "https://randomuser.me/api/portraits/men/1.jpg"

    useEffect(() => {

        const audio = new Audio(CallSound);
        audio.loop = true;
        audio.play();
        audioRef.current = audio;

        const timer = setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 20000);

        return () => {
            clearTimeout(timer);
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const handleMicrophoneMode = () => {
        setMicrophoneMode(!isMicrophoneOn);
    };

    const handleSpeakerMode = () => {
        setSpeakerMode((prevMode) => {
            const newMode = !prevMode;
            if (audioRef.current) {
                audioRef.current.volume = newMode ? 1 : 0; 
            }
            return newMode;
        });
    };


    const handleCameraCall = () => {
        // Kamera çağrısı için işlev
    };

    const handleCloseCall = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        closeModal();
    };

    return (
        <div className='call-modal'>
            <div className='logo-and-e2e-box'>
                <img src={MingleLogo} alt="Mingle Logo" />
                <div className='e2e-box'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 6c1.4 0 2.8 1.1 2.8 2.5V11c.6 0 1.2.6 1.2 1.3v3.5c0 .6-.6 1.2-1.3 1.2H9.2c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2V9.5C9.2 8.1 10.6 7 12 7m0 1.2c-.8 0-1.5.5-1.5 1.3V11h3V9.5c0-.8-.7-1.3-1.5-1.3" /></svg>
                    <p>Uçtan uca şifrelenmiş</p>
                </div>
            </div>
            <div className='user-and-call-time-box'>
                <img src={userImage} alt="User Image" />
                <p>{userName}</p>
                <span>{callStatus}</span>
            </div>
            <div className='call-option-buttons'>
                <button><MdScreenShare /></button>

                <button onClick={handleCameraCall}><HiMiniVideoCamera /></button>

                <button onClick={handleSpeakerMode}>
                    {isSpeakerOn ? <HiMiniSpeakerWave /> : <HiMiniSpeakerXMark />}
                </button>

                <button onClick={handleMicrophoneMode}>
                    {isMicrophoneOn ? <TbMicrophoneFilled /> : <TbMicrophoneOff />}
                </button>

                <button onClick={handleCloseCall}><PiPhoneSlashFill /></button>
            </div>
        </div>
    );
}

export default CallModal;
