import React, { useEffect } from 'react';
import UserImage from "../../../../assets/users/okan.png";
import { PiPhoneFill } from "react-icons/pi";
import { PiPhoneSlashFill } from "react-icons/pi";

import IncomingCallSound from "../../../../assets/sounds/MingleCallSound.mp3";
import "./style.scss";

function IncomingCall() {
    const userName = "Okan Doğan";

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
            <img src={UserImage} alt="User Image" />
            <div className='user-info-and-call-status'>
                <p>{userName}</p>
                <span>Seni Arıyor...</span>
            </div>
            <div className='call-option-buttons'>
                <button><PiPhoneFill /></button>
                <button><PiPhoneSlashFill /></button>
            </div>
        </div>
    );
}

export default IncomingCall;
