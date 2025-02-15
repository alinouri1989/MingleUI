import React from 'react'
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import CallModal from '../../Calls/Components/CallModal';
import { useModal } from '../../../contexts/ModalContext';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateForLastConnectionDate } from '../../../helpers/dateHelper';
import { useSignalR } from '../../../contexts/SignalRContext';
import { setIsCallStarted, setIsCallStarting } from '../../../store/Slices/calls/callSlice';
import useScreenWidth from '../../../hooks/useScreenWidth';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';
import BackToMenuButton from '../../../shared/components/BackToMenuButton/BackToMenuButton';

function UserTopBar({ isSidebarOpen, toggleSidebar, recipientProfile, recipientId }) {

    if (!recipientProfile) {
        return null;
    }

    const { callConnection } = useSignalR();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const status = recipientProfile.lastConnectionDate == "0001-01-01T00:00:00" ? 'online' : 'offline';
    const lastConnectionDate = recipientProfile.lastConnectionDate;

    const { showModal, closeModal } = useModal();
    const { isCallStarted, callId } = useSelector((state) => state.call);
    const isSmallScreen = useScreenWidth(900);

    const handleVoiceCall = async () => {
        if (callConnection) {
            try {
                await callConnection.invoke("StartCall", recipientId, 0);
                dispatch(setIsCallStarting(true));
                showModal(<CallModal callId={callId} closeModal={closeModal} isCameraCall={false} />);
            } catch (error) {
                console.error("Error starting voice call:", error);
            }
        }
    };

    const handleVideoCall = async () => {
        if (callConnection) {
            try {
                await callConnection.invoke("StartCall", recipientId, 1);
                dispatch(setIsCallStarting(true));
                showModal(<CallModal callId={callId} closeModal={closeModal} isCameraCall={true} />);
            } catch (error) {
                console.error("Error starting voice call:", error);
            }
        }
    }

    return (
        <div className={`user-top-bar ${isSidebarOpen ? 'close' : ''}`}>
            <div className="user-info">
                {isSmallScreen && (
                    <BackToMenuButton
                        path={location.pathname.includes("arsivler") ? "arsivler" : "sohbetler"}
                    />
                )}

                <div onClick={toggleSidebar} className="image-box">
                    <img src={recipientProfile.profilePhoto} alt={`${recipientProfile.displayName} profile`} />
                    <p className={`status ${status}`}></p>
                </div>
                <div onClick={toggleSidebar} className="name-and-status-box">
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
                    <button onClick={() => handleVoiceCall()}><PiPhoneFill /></button>
                    <button onClick={() => handleVideoCall()}><HiMiniVideoCamera /></button>
                </div>
                {!isSmallScreen &&
                    <IoIosArrowDropleftCircle
                        className="sidebar-toggle-buttons"
                        onClick={toggleSidebar}
                    />
                }
            </div>
        </div>
    )
}

export default UserTopBar