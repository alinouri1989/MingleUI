import React from 'react'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { useModal } from '../../../contexts/ModalContext';
import CallModal from '../../Calls/Components/CallModal';

function UserDetailsBar({ isSidebarOpen, toggleSidebar, user }) {

    const { showModal, closeModal } = useModal();

    const handleVoiceCall = () => {
        showModal(<CallModal closeModal={closeModal} />);
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
                            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt={`profile`} />
                            <p>Okan Doğan</p>
                            <span>okandogan20@gmail.com</span>
                        </div>
                        <div className='status'>
                            <p className='circle'></p>
                            <p>Çevrimiçi</p>
                        </div>

                        {/* <div className='status-2'>
                            <p>Son Görülme</p>
                            <span>28.10.2024</span>
                        </div> */}

                        <div className='biography'>
                            <strong>Biyografi</strong>
                            <div className='line'></div>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores id vitae corporis ex, atque animi distinctio minima commodi explicabo qui?</p>
                        </div>
                        <div className='call-buttons'>
                            <div className='button-box'>
                                <button onClick={handleVoiceCall}><PiPhoneFill /> </button>
                                <p>Sesli Ara</p>
                            </div>
                            <div className='button-box'>
                                <button><HiMiniVideoCamera /></button>
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