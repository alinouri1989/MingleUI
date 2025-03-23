import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSignalR } from "../../../contexts/SignalRContext";

import MingleLogo from "../../../assets/logos/MingleLogoWithText.webp";
import CallSound from "../../../assets/sound/MingleCallSound.mp3";
import BusySound from "../../../assets/sound/MingleCallBusySound.mp3"

import { MdScreenShare } from "react-icons/md";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import { HiMiniSpeakerWave } from "react-icons/hi2";
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { TbMicrophoneFilled } from "react-icons/tb";
import { TbMicrophoneOff } from "react-icons/tb";
import { PiPhoneSlashFill } from "react-icons/pi";
import { MdFlipCameraIos } from "react-icons/md";

import { formatTime } from "../../../helpers/formatCallTime";
import "./CallModal.scss";
import { defaultProfilePhoto } from "../../../constants/DefaultProfilePhoto";
import { ErrorAlert } from "../../../helpers/customAlert";
import useScreenWidth from "../../../hooks/useScreenWidth";

function CallModal({ closeModal, isCameraCall }) {
    const { callConnection, localStream, remoteStream, setLocalStream } = useSignalR();

    const { callerProfile, callId, isCallStarted, isRingingOutgoing, callStartedDate, isCallStarting } = useSelector((state) => state.call);

    const [isMicrophoneOn, setMicrophoneMode] = useState(true);
    const [isSpeakerOn, setSpeakerMode] = useState(true);
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [callStatus, setCallStatus] = useState("Aranıyor...");

    const isSmallScreen = useScreenWidth(1000);

    const callAudioRef = useRef(null);
    const busyAudioRef = useRef(null);

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

        return () => {
            if (temporaryStream) {
                temporaryStream.getTracks().forEach((track) => track.stop());
                setTemporaryStream(null);
            }
        };
    }, [temporaryStream, isCameraCall]);

    useEffect(() => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream || temporaryStream;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }

        return () => {
            if (localVideoRef.current) localVideoRef.current.srcObject = null;
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        };
    }, [localStream, temporaryStream, remoteStream]);


    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = isMicrophoneOn;
            });
        }
    }, [localStream, isMicrophoneOn]);

    useEffect(() => {
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [localStream]);


    callConnection.on('ValidationError', (data) => {
        ErrorAlert(data.message);
    });


    useEffect(() => {
        if (isCallStarting) {
            const callAudio = new Audio(CallSound);
            callAudio.loop = true;
            callAudio.play();
            callAudioRef.current = callAudio;

            let timeout = setTimeout(() => {
                if (!isCallStarted) {

                    setCallStatus("Meşgul");

                    if (callAudioRef.current) {
                        callAudioRef.current.pause();
                        callAudioRef.current.currentTime = 0;
                    }

                    const busyAudio = new Audio(BusySound);
                    busyAudio.play();
                    busyAudioRef.current = busyAudio;

                    setTimeout(() => {
                        if (busyAudioRef.current) {
                            busyAudioRef.current.pause();
                            busyAudioRef.current.currentTime = 0;
                        }
                        callConnection.invoke("EndCall", callId, 4, callStartedDate);
                        closeModal();
                    }, 4000);
                }
            }, 25000);

            return () => {
                clearTimeout(timeout);

                if (callAudioRef.current) {
                    callAudioRef.current.pause();
                    callAudioRef.current.currentTime = 0;
                }

                if (busyAudioRef.current) {
                    busyAudioRef.current.pause();
                    busyAudioRef.current.currentTime = 0;
                }
            };
        }
    }, [isCallStarting, isCallStarted, callId]);


    useEffect(() => {
        if (!isCallStarted && !isRingingOutgoing) {
            closeModal();
        }
    }, [isCallStarted, isRingingOutgoing]);


    useEffect(() => {
        let timerInterval;
        if (isCallStarted) {
            if (callAudioRef.current) {
                callAudioRef.current.pause();
                callAudioRef.current.currentTime = 0;
            }

            setCallStatus("Bağlandı");
            let elapsedTime = 0;
            timerInterval = setInterval(() => {
                elapsedTime += 1;
                setCallStatus(formatTime(elapsedTime));
            }, 1000);
        } else {
            clearInterval(timerInterval);
            setCallStatus("Aranıyor...");
            if (isCallStarted === false && isCallStarting === false) {
                closeModal();
            }
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isCallStarted]);


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
        if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = isSpeakerOn;
        }
        setSpeakerMode(!isSpeakerOn);

        if (isSpeakerOn) {
            if (callAudioRef.current) {
                callAudioRef.current.volume = 0;
            }
            if (busyAudioRef.current) {
                busyAudioRef.current.volume = 0;
            }
        } else {
            if (callAudioRef.current) {
                callAudioRef.current.volume = 1;
            }
            if (busyAudioRef.current) {
                busyAudioRef.current.volume = 1;
            }
        }
    };

    const handleCloseCall = () => {
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


    const handleCameraFlip = async () => {
        if (localStream) {
            // Eski video track'ini durdur
            localStream.getVideoTracks().forEach((track) => track.stop());
        }

        // Kamera türünü tersine çevir
        const newCameraType = isFrontCamera ? "environment" : "user"; // "environment" arka kamera, "user" ön kamera

        try {
            // Yeni bir stream al
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newCameraType },
                audio: false, // Ses almak istemiyoruz, sadece video
            });

            // Yeni stream'i video track'e ekle
            newStream.getTracks().forEach((track) => {
                peerConnection.current.addTrack(track, newStream);
            });

            // Local stream'i güncelle
            setLocalStream(newStream);

            // Kameranın türünü değiştir
            setIsFrontCamera(!isFrontCamera); // Ön kamera ise arka, arka kamera ise ön yap
        } catch (error) {
            console.error('Kamera değiştirilemedi:', error);
        }
    };


    return (
        <div className={`call-modal ${isCallStarted ? 'video-call-Mode' : ''}`}>
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
                    <img src={callerProfile?.profilePhoto}
                        onError={(e) => e.currentTarget.src = defaultProfilePhoto}
                        alt="Profile Image"
                    />
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

                <button
                    onClick={isSmallScreen ? (isCameraCall ? handleCameraFlip : handleAddPerson) : handleDisabled}
                    className={isSmallScreen ? (isCameraCall ? "" : "disabled") : "disabled"}
                >
                    {isCameraCall ? <MdFlipCameraIos /> : <PersonAddAlt1Icon />}
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
