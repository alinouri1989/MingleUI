import React, { useEffect } from 'react';
import UserImage from "../../../../assets/users/okan.png";
import { PiPhoneFill } from "react-icons/pi";
import { PiPhoneSlashFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";

import IncomingCallSound from "../../../../assets/sounds/MingleCallSound.mp3";
import { useSignalR } from '../../../../contexts/SignalRContext';
import { setIsRingingIncoming } from '../../../../store/Slices/calls/callSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createAndSendOffer, startLocalStream } from '../../../../services/webRtcService';
import { useModal } from '../../../../contexts/ModalContext';
import CallModal from '../CallModal';
import "./style.scss";


function IncomingCall({ callType, callerProfile, callId }) {
    const { callConnection, initializePeerConnection, peerConnection, handleAcceptCall } = useSignalR();
    const { isCallStarted } = useSelector(state => state.call);
    const dispatch = useDispatch();

    const { showModal, closeModal } = useModal();

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
            await callConnection.invoke("EndCall", callId, 2);
            dispatch(setIsRingingIncoming(false));
        } catch (error) {
            console.log("Arama sonlandırılamadı: ", error);
        }
    };

    useEffect(() => {
        if (isCallStarted) {
            showModal(<CallModal callId={callId} closeModal={closeModal} />);
            setIsRingingIncoming(false);
        }
    }, [isCallStarted])

    return (
        <div className='incoming-call-box'>
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
    );
}

export default IncomingCall;
