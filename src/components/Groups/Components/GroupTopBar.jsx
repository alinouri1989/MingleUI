import React from 'react'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { defaultGroupPhoto } from '../../../constants/DefaultProfilePhoto';
function GroupTopBar({ isSidebarOpen, toggleSidebar, groupProfile }) {


    const participantCount = groupProfile?.participants
        ? Object.keys(groupProfile.participants).length
        : 0;

    return (
        <div className={`group-top-bar ${isSidebarOpen ? 'close' : ''}`}>
            <div className="group-info">
                <div className="image-box">
                    <img src={groupProfile?.photoUrl} />

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