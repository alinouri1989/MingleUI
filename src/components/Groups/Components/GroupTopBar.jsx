import React from 'react'
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import YardimlasmaGrubu from "../../../assets/YardimlasmaGrubu.png"
import { defaultGroupPhoto } from '../../../constants/DefaultProfilePhoto';
function GroupTopBar({ isSidebarOpen, toggleSidebar, groupProfile }) {
    // Props olarak alır.

    console.log("groupProfile", groupProfile);


    const participantCount = groupProfile?.participants
    ? Object.keys(groupProfile.participants).length
    : 0;

    return (
        <div className={`group-top-bar ${isSidebarOpen ? 'close' : ''}`}>
            <div className="group-info">
                <div className="image-box">
                    <img src={defaultGroupPhoto}/>
                    {/* groupProfile?.photoUrl */}
                </div>
                <div className="name-and-status-box">
                    <p className="grup-name">{groupProfile?.name}</p>
                    <span>{participantCount} kullanıcı bulunuyor</span>
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