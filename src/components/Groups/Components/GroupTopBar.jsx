import React from 'react'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import useScreenWidth from '../../../hooks/useScreenWidth';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import BackToMenuButton from '../../../shared/components/BackToMenuButton/BackToMenuButton';

function GroupTopBar({ isSidebarOpen, toggleSidebar, groupProfile }) {

    const participantCount = groupProfile?.participants
        ? Object.values(groupProfile.participants).filter(member => member.role !== 2).length
        : 0;

    const isSmallScreen = useScreenWidth(900);
    const navigate = useNavigate();


    return (
        <div onClick={toggleSidebar} className={`group-top-bar ${isSidebarOpen ? 'close' : ''}`}>
            <div className="group-info">
                {isSmallScreen &&
                    <BackToMenuButton path={"gruplar"} />
                }
                <div className="image-box">
                    <img src={groupProfile?.photoUrl} alt="Group" />
                </div>
                <div className="name-and-status-box">
                    <p className="grup-name">{groupProfile?.name}</p>
                    <span>{participantCount} kullanıcı bulunuyor</span>
                </div>
            </div>

            {!isSmallScreen && (
                <div className="top-bar-buttons">
                    <IoIosArrowDropleftCircle
                        className="sidebar-toggle-buttons"
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleSidebar();
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default GroupTopBar;
