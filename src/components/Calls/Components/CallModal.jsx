import { useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import MingleLogo from "../../../assets/logos/MingleLogoWithText.svg";
import CallSound from "../../../assets/Sounds/MingleCallSound.mp3";
import { useSignalR } from "../../../contexts/SignalRContext";

import { MdScreenShare } from "react-icons/md";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { TbMicrophoneFilled } from "react-icons/tb";
import { TbMicrophoneOff } from "react-icons/tb";
import { PiPhoneSlashFill } from "react-icons/pi";
import { HiVideoCameraSlash } from "react-icons/hi2";

import "./CallModal.scss";
import { formatTime } from "../../../helpers/formatCallTime";

function CallModal({ closeModal, isVideoCallMode }) {

    const { callConnection } = useSignalR();
    const { localStream, remoteStream } = useSignalR();

    const { callerProfile, callId, isCallStarted, isRingingOutgoing } = useSelector((state) => state.call);

    const [isMicrophoneOn, setMicrophoneMode] = useState(true);
    const [isSpeakerOn, setSpeakerMode] = useState(true);
    const [callStatus, setCallStatus] = useState("Aranıyor...");


    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [isVideoCall, setIsVideoCall] = useState(false);


    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);


    const audioRef = useRef(null);

    useEffect(() => {
        if (isVideoCallMode) {
            setIsWebcamOpen(!isWebcamOpen);
            setIsVideoCall(true);

            if (!isWebcamOpen) {
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                        localVideoRef.current.srcObject = stream;
                    })
                    .catch((err) => {
                        console.error("Kamera başlatılamadı:", err);
                    });
            } else {

            }
        }
    }, []);

    useEffect(() => {
        if (!isCallStarted && !isWebcamOpen) {
            setIsVideoCall(false);
        }
    }, [isCallStarted, isWebcamOpen]);

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

    // useEffect(() => {
    //     if (!isCallStarted && !isRingingOutgoing) {
    //         closeModal();
    //     }
    // }, [isCallStarted, isRingingOutgoing]);


    useEffect(() => {
        let timerInterval;
        if (isCallStarted) {
            let elapsedTime = 0;
            timerInterval = setInterval(() => {
                elapsedTime += 1;
                const formattedTime = formatTime(elapsedTime);
                setCallStatus(formattedTime);
            }, 1000);
        } else {
            clearInterval(timerInterval);
            setCallStatus("Aranıyor...");
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isCallStarted]);

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

    const handleCameraToggle = () => {
        if (!isWebcamOpen) {
            // Kamera aç
            setIsWebcamOpen(true);
            setIsVideoCall(true);
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    localVideoRef.current.srcObject = stream; // Kamerayı bağla
                })
                .catch((err) => {
                    console.error("Kamera başlatılamadı:", err);
                });
        } else {
            // Kamera kapat
            console.log("Girdi");
            if (localVideoRef.current?.srcObject) {
                // Tüm medya akışlarını durdur
                localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
                localVideoRef.current.srcObject = null; // Referansı temizle
            }
            setIsWebcamOpen(false); // Kamera kapalı durumunu güncelle
        }
    };

    const handleCloseCall = () => {
        if (localVideoRef.current?.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }

        callConnection.invoke("EndCall", callId, 3);

        closeModal();
    };

    // const simulateRemoteConnection = () => {
    //     setIsVideoCall(true);
    //     // Karşı taraf kamerası simülasyonu
    //     navigator.mediaDevices
    //         .getUserMedia({ video: true })
    //         .then((stream) => {
    //             remoteVideoRef.current.srcObject = stream;
    //         })
    //         .catch((err) => console.error("Uzaktan kamera bağlanamadı:", err));
    // };

    return (
        <div className={`call-modal ${(isWebcamOpen || isCallStarted) ? 'video-call-Mode' : ''}`}>
            {/* Logo ve şifreleme bilgisi */}
            <div className="logo-and-e2e-box">
                <img src={MingleLogo} alt="Mingle Logo" />
                <div className="e2e-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 6c1.4 0 2.8 1.1 2.8 2.5V11c.6 0 1.2.6 1.2 1.3v3.5c0 .6-.6 1.2-1.3 1.2H9.2c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2V9.5C9.2 8.1 10.6 7 12 7m0 1.2c-.8 0-1.5.5-1.5 1.3V11h3V9.5c0-.8-.7-1.3-1.5-1.3"
                        />
                    </svg>
                    <p>Uçtan uca şifrelenmiş</p>
                </div>
            </div>

            {/* Kullanıcı bilgisi */}
            {/* {!isCallStarted &&
                <div className={`user-and-call-time-box ${isWebcamOpen ? 'video-call-Mode' : ''}`}>
                    <img src={callerProfile?.profilePhoto} alt="User" />
                    <p>{callerProfile?.displayName}</p>
                    <span>{callStatus}</span>
                </div>
            } */}

            {/* Kamera Görünümü */}

            <h3>Local</h3>
            <video
                className="local-ref-box"
                ref={localVideoRef}
                autoPlay
                muted
                style={{ width: "120px", border: "1px solid black" }}
            />

            <h2>Uzak </h2>
            <video
                className="remote-ref-box"
                ref={remoteVideoRef}
                autoPlay
                style={{ width: "120px", border: "1px solid black" }}
            />
            <>
                <div className={`camera-bar ${!isVideoCall ? "only-voice-call" : ""}`}>
                    {/* {isWebcamOpen &&
                        <div className={`device-camera-box ${isCallStarted ? 'remote-connected' : ''}`}>
                            <video playsInline ref={localVideoRef} autoPlay muted></video>
                        </div>
                    }

                    {isCallStarted && (
                        <div className="other-camera-box">
                            <video ref={remoteVideoRef} autoPlay></video>
                            <div className="user-info">
                                <img src={callerProfile.profilePhoto} alt="" />
                                <p>{callerProfile.displayName}</p>
                            </div>
                        </div>
                    )} */}
                </div>

                <p className="video-call-time-status">{callStatus}</p>
            </>


            {/* Arama seçenekleri */}
            <div className="call-option-buttons">
                <button>
                    <MdScreenShare />
                </button>

                <button onClick={handleCameraToggle}>
                    {isWebcamOpen ? <HiMiniVideoCamera /> : <HiVideoCameraSlash />}

                </button>

                <button onClick={handleSpeakerMode}>
                    {isSpeakerOn ? <HiMiniSpeakerWave /> : <HiMiniSpeakerXMark />}
                </button>

                <button onClick={handleMicrophoneMode}>
                    {isMicrophoneOn ? <TbMicrophoneFilled /> : <TbMicrophoneOff />}
                </button>

                <button onClick={handleCloseCall}>
                    <PiPhoneSlashFill />
                </button>
            </div>

            {/* {!isCallStarted && (
                <button className="simulate-connection" onClick={simulateRemoteConnection}>
                    Karşı Tarafı Bağla (Simülasyon)
                </button>
            )}
            {isCallStarted && (
                <button className="simulate-connection" >
                    karşının bağlantıyı kopar
                </button>
            )} */}
        </div>
    );
}

export default CallModal;
