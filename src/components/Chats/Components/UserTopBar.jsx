import React from 'react'
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import CallModal from '../../Calls/Components/CallModal';
import { useModal } from '../../../contexts/ModalContext';
import { useSelector } from 'react-redux';
import { formatDateForLastConnectionDate } from '../../../helpers/dateHelper';
import { useSignalR } from '../../../contexts/SignalRContext';

function UserTopBar({ isSidebarOpen, toggleSidebar, recipientProfile, recipientId }) {

    if (!recipientProfile) {
        return null;
    }
    const { callConnection } = useSignalR();

    const status = recipientProfile.lastConnectionDate == "0001-01-01T00:00:00" ? 'online' : 'offline';
    const lastConnectionDate = recipientProfile.lastConnectionDate;

    const { showModal, closeModal } = useModal();

    const handleVoiceCall = async () => {

    };


    const handleVideoCall = async () => {
        console.log("Call connection durumu:", callConnection);
        if (callConnection) {
            console.log("Girdi mi?");
            try {
                // StartCall metodunu invoke ediyoruz.
                await callConnection.invoke("StartCall", recipientId, 1);
                // console.log("Voice call started with:", recipientId);

                // Burada, modal açma veya diğer işlemleri yapabilirsiniz.
                // showModal(<CallModal closeModal={closeModal} />);
            } catch (error) {
                console.error("Error starting voice call:", error);
            }
        }
    }

    return (
        <div className={`user-top-bar ${isSidebarOpen ? 'close' : ''}`}>
            <div className="user-info">
                <div className="image-box">
                    <img src={recipientProfile.profilePhoto} alt={`${recipientProfile.displayName} profile`} />
                    <p className={`status ${status}`}></p>
                </div>
                <div className="name-and-status-box">
                    <p className="user-name">{recipientProfile.displayName}</p>

                    {status == "online" ?
                        <span>Çevrimiçi</span>
                        :
                        <span>{formatDateForLastConnectionDate(lastConnectionDate)}</span>
                    }
                </div>
            </div>

            <div className="top-bar-buttons">
                <div className='call-options'>
                    <button onClick={handleVoiceCall}><PiPhoneFill /></button>
                    <button onClick={() => handleVideoCall()}><HiMiniVideoCamera /></button>
                </div>
                <IoIosArrowDropleftCircle
                    className="sidebar-toggle-buttons"
                    onClick={toggleSidebar}
                />
            </div>
        </div>
    )
}

export default UserTopBar