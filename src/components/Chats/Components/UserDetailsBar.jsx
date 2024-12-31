import React from 'react'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { useModal } from '../../../contexts/ModalContext';
import CallModal from '../../Calls/Components/CallModal';
import { formatDateForLastConnectionDate } from '../../../helpers/dateHelper';

function UserDetailsBar({ isSidebarOpen, toggleSidebar, recipientProfile }) {

    if (!recipientProfile) {
        return null;
    }

    const status = recipientProfile.connectionSettings.lastConnectionDate ? 'offline' : 'online';
    const lastConnectionDate = recipientProfile.connectionSettings.lastConnectionDate;


    const { showModal, closeModal } = useModal();
    const handleVoiceCall = () => {
        showModal(<CallModal closeModal={closeModal} />);
    }
    const handleVideoCall = () => {
        showModal(<CallModal isVideoCallMode={true} closeModal={closeModal} />);
    }

    return (
        <div className={`user-details-sidebar ${isSidebarOpen ? "open" : ""}`}>
            {isSidebarOpen &&
                <>
                    <IoIosArrowDroprightCircle
                        className="sidebar-toggle-buttons"
                        onClick={toggleSidebar}
                    />

                    <div className='sidebar-content-box'>
                        <div className='user-info-box'>
                            <img src={recipientProfile.profilePhoto} alt={`profile`} />
                            <p>{recipientProfile.displayName}</p>
                            <span>{recipientProfile.email}</span>
                        </div>
                        {status == "online" ?
                            <div className='status'>
                                <p className='circle'></p>
                                <p>Çevrimiçi</p>
                            </div>
                            :
                            <div className='status-2'>
                                <p>Son Görülme</p>
                                <span>{formatDateForLastConnectionDate(lastConnectionDate)}</span>
                            </div>
                        }

                        <div className='biography'>
                            <strong>Biyografi</strong>
                            <div className='line'></div>
                            <p>{recipientProfile.biography}</p>
                        </div>
                        <div className='call-buttons'>
                            <div className='button-box'>
                                <button onClick={handleVoiceCall}><PiPhoneFill /> </button>
                                <p>Sesli Ara</p>
                            </div>
                            <div className='button-box'>
                                <button onClick={handleVideoCall}><HiMiniVideoCamera /></button>
                                <p>Görüntülü Ara</p>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default UserDetailsBar