import React from 'react'
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowDropleftCircle } from "react-icons/io";

function UserTopBar({ isSidebarOpen, toggleSidebar }) {
    // Props olarak alır.
    const userName = "Okan Doğan"
    const status = "online"
    return (
        <div className={`user-top-bar ${isSidebarOpen ? 'close' : ''}`}>
            <div className="user-info">
                <div className="image-box">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt={`${userName} profile`} />
                    <p className={`status ${status}`}></p>
                </div>
                <div className="name-and-status-box">
                    <p className="user-name">{userName}</p>
                    <span>{status == "online" ? "Çevrimiçi" : "Çevrimdışı"}</span>
                </div>
            </div>

            <div className="top-bar-buttons">
                <div className='call-options'>
                    <button><PiPhoneFill /></button>
                    <button><HiMiniVideoCamera /></button>
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