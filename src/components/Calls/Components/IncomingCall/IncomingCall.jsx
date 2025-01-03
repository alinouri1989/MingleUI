import React, { useEffect } from 'react';
import UserImage from "../../../../assets/users/okan.png";
import { PiPhoneFill } from "react-icons/pi";
import { PiPhoneSlashFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";

import IncomingCallSound from "../../../../assets/sounds/MingleCallSound.mp3";
import "./style.scss";

function IncomingCall({ callType, callerProfile }) {

    useEffect(() => {
        const audio = new Audio(IncomingCallSound);
        audio.loop = true;
        audio.play();

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <div className='incoming-call-box'>
            <img src={callerProfile.profilePhoto} alt="User Image" />
            <div className='user-info-and-call-status'>
                <p>{callerProfile.displayName}</p>
                <span>Seni Arıyor...</span>
            </div>
            <div className='call-option-buttons'>
                <button>
                    {callType == 0 ? <PiPhoneFill /> : <HiMiniVideoCamera />}
                </button>
                <button><PiPhoneSlashFill /></button>
            </div>
        </div>
    );
}

export default IncomingCall;
