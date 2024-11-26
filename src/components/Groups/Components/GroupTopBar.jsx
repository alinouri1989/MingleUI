import React from 'react'
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import YardimlasmaGrubu from "../../../assets/YardimlasmaGrubu.png"
function GroupTopBar({ isSidebarOpen, toggleSidebar }) {
    // Props olarak alır.
    const groupName = "Yardımlaşma Grubu"
    const userNumbers = "9"

    return (
        <div className={`group-top-bar ${isSidebarOpen ? 'close' : ''}`}>
            <div className="group-info">
                <div className="image-box">
                    <img src={YardimlasmaGrubu} alt={`${groupName} profile`} />
                </div>
                <div className="name-and-status-box">
                    <p className="grup-name">{groupName}</p>
                    <span>{userNumbers} kullanıcı bulunuyor</span>
                </div>
            </div>

            <div className="top-bar-buttons">
                <IoIosArrowDropleftCircle
                    className="sidebar-toggle-buttons"
                    onClick={toggleSidebar}
                />
            </div>
        </div>
    )
}

export default GroupTopBar