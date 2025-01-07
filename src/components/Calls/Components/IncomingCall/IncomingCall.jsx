import React, { useEffect, useRef } from 'react';
import UserImage from "../../../../assets/users/okan.png";
import { PiPhoneFill } from "react-icons/pi";
import { PiPhoneSlashFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";

import IncomingCallSound from "../../../../assets/sounds/MingleCallSound.mp3";
import { useSignalR } from '../../../../contexts/SignalRContext';
import { setIsRingingIncoming } from '../../../../store/Slices/calls/callSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../../../contexts/ModalContext';
import CallModal from '../CallModal';
import "./style.scss";


function IncomingCall({ callType, callerProfile, callId }) {
    const { callConnection, initializePeerConnection, peerConnection, handleAcceptCall } = useSignalR();
    const { isCallStarted } = useSelector(state => state.call);
    const dispatch = useDispatch();

    const { showModal, closeModal } = useModal();
    const { localStream } = useSignalR();

    const localVideoRef = useRef(null);


    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        const audio = new Audio(IncomingCallSound);
        audio.loop = true;
        audio.play();

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const handleDeclineCall = async () => {
        try {
            await callConnection.invoke("EndCall", callId, 2, null);
            dispatch(setIsRingingIncoming(false));
        } catch (error) {
            console.log("Arama sonlandırılamadı: ", error);
        }
    };

    useEffect(() => {
        if (isCallStarted) {
            dispatch(setIsRingingIncoming(false));
            showModal(<CallModal callId={callId} closeModal={closeModal} />);
        }
    }, [isCallStarted])

    return (
        <div className='incoming-call-box'>
            <div className='user-and-options'>
                <img src={callerProfile.profilePhoto} alt="User Image" />
                <div className='user-info-and-call-status'>
                    <p>{callerProfile.displayName}</p>
                    <span>Seni Arıyor...</span>
                </div>
                <div className='call-option-buttons'>
                    <button onClick={() => handleAcceptCall()}>
                        {callType === 0 ? <PiPhoneFill /> : <HiMiniVideoCamera />}
                    </button>
                    <button onClick={handleDeclineCall}>
                        <PiPhoneSlashFill />
                    </button>
                </div>
            </div>
            <video className='local-video' playsInline ref={localVideoRef} autoPlay muted></video>
        </div>
    );
}

export default IncomingCall;
