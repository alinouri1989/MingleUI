import { useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import MingleLogo from "../../../assets/logos/MingleLogoWithText.svg";
import CallSound from "../../../assets/Sounds/MingleCallSound.mp3";
import BusySound from "../../../assets/Sounds/MingleCallBusySound.mp3";
import { useSignalR } from "../../../contexts/SignalRContext";

import { MdScreenShare } from "react-icons/md";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { LuUserPlus } from "react-icons/lu";

import { HiMiniSpeakerWave } from "react-icons/hi2";
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { TbMicrophoneFilled } from "react-icons/tb";
import { TbMicrophoneOff } from "react-icons/tb";
import { PiPhoneSlashFill } from "react-icons/pi";
import { HiVideoCameraSlash } from "react-icons/hi2";

import "./CallModal.scss";
import { formatTime } from "../../../helpers/formatCallTime";


function CallModal({ closeModal, isCameraCall }) {

    const { callConnection } = useSignalR();
    const { localStream, remoteStream } = useSignalR();

    const { callerProfile, callId, isCallStarted, isRingingOutgoing, callStartedDate, isCallStarting } = useSelector((state) => state.call);

    const [isMicrophoneOn, setMicrophoneMode] = useState(true);
    const [isSpeakerOn, setSpeakerMode] = useState(true);
    const [callStatus, setCallStatus] = useState("Aranıyor...");

    const audioRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [temporaryStream, setTemporaryStream] = useState(null);

    useEffect(() => {
        const getTemporaryStream = async () => {
            try {
                if (isCameraCall && !localStream && !temporaryStream) {
                    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    setTemporaryStream(tempStream);
                }
            } catch (error) {
                console.error('Geçici stream alınırken hata:', error);
            }
        };

        getTemporaryStream();

        // Temizlik işlemi
        return () => {
            if (temporaryStream) {
                temporaryStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [localStream, temporaryStream, isCameraCall]);


    useEffect(() => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream || temporaryStream;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [localStream, temporaryStream, remoteStream]);

    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = isMicrophoneOn;
            });
        }
    }, [localStream, isMicrophoneOn]);



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

    useEffect(() => {
        if (!isCallStarted && !isRingingOutgoing) {
            closeModal();
            localVideoRef.current == null;
        }
    }, [isCallStarted, isRingingOutgoing]);


    useEffect(() => {
        let timerInterval;
        if (isCallStarted) {
            setTemporaryStream(null);
            if (isCallStarted && audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            let elapsedTime = 0;
            timerInterval = setInterval(() => {
                elapsedTime += 1;
                const formattedTime = formatTime(elapsedTime);
                setCallStatus(formattedTime);
            }, 1000);
        } else {
            clearInterval(timerInterval);
            setCallStatus("Aranıyor...");
            if (isCallStarted == false && isCallStarting == false) {
                closeModal();
                localVideoRef.current == null;
            }
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isCallStarted]);


    useEffect(() => {
        let timeout;
        if (isCallStarting) {
            timeout = setTimeout(() => {
                if (!isCallStarted) {
                    console.log("CallId", callId);
                    setCallStatus("Meşgul");
                    setTimeout(() => {
                        callConnection.invoke("EndCall", callId, 4, callStartedDate);
                        closeModal();
                    }, 4000);
                }
            }, 20000);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [isCallStarting, isCallStarted, callId]);

    const handleMicrophoneMode = () => {
        setMicrophoneMode((prev) => {
            if (localStream) {
                localStream.getAudioTracks().forEach(track => {
                    track.enabled = !prev;
                });
            } else {
                console.warn("Local stream mevcut değil!");
            }
            return !prev;
        });
    };

    const handleSpeakerMode = () => {
        if (remoteStream) {
            remoteStream.getAudioTracks().forEach(track => {
                track.enabled = !isSpeakerOn;
            });
        }

        if (audioRef.current) {
            audioRef.current.volume = isSpeakerOn ? 0 : 1;
        }

        setSpeakerMode(!isSpeakerOn);
    };

    const handleCloseCall = () => {
        if (localVideoRef.current?.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }

        if (isCallStarted) {
            callConnection.invoke("EndCall", callId, 1, callStartedDate);
        }
        if (isCallStarting) {
            if (callStatus == "Meşgul") {
                callConnection.invoke("EndCall", callId, 4, callStartedDate);
            }
            else {
                callConnection.invoke("EndCall", callId, 3, callStartedDate);
            }
        }
        closeModal();
    };


    return (
        <div className={`call-modal ${isCallStarted ? 'video-call-Mode' : ''}`}>
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

            {(!isCallStarted || (isCallStarted && !isCameraCall)) && (
                <div
                    className={`user-and-call-time-box ${isCameraCall ? "cameraCall" : ""}`}
                >
                    <img src={callerProfile?.profilePhoto} alt="User" />
                    <p>{callerProfile?.displayName}</p>
                    <span>{callStatus}</span>
                </div>
            )}
            <>
                <div className={`camera-bar ${!isCameraCall ? 'only-voice-call' : ''}`}>
                    {isCallStarted && (
                        <div className="other-camera-box">
                            <video ref={remoteVideoRef} autoPlay></video>
                            <div className="user-info">
                                <img src={callerProfile?.profilePhoto} alt="" />
                                <p>{callerProfile?.displayName}</p>
                            </div>
                        </div>
                    )}

                    <div className={`device-camera-box ${isCallStarted ? 'remote-connected' : ''}`}>
                        {isCameraCall &&
                            <video
                                playsInline
                                ref={localVideoRef}
                                autoPlay
                                muted
                            ></video>
                        }
                    </div>
                </div>

                {isCallStarted && isCameraCall && <p className="video-call-time-status">{callStatus}</p>}
            </>


            <div className="call-option-buttons">
                <button className="disabled">
                    <MdScreenShare />
                </button>

                <button className="disabled">
                    <PersonAddAlt1Icon />
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
        </div>
    );
}

export default CallModal;
