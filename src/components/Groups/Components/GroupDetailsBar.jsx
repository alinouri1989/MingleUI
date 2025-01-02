import React, { useState, useEffect } from 'react';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import YardimlasmaGrubu from "../../../assets/YardimlasmaGrubu.png";
import { useModal } from '../../../contexts/ModalContext';
import NewGroupModal from './NewAndSettingsGroup/NewGroupModal';
import { useGetGroupProfileQuery } from '../../../store/Slices/Group/GroupApi';
import PreLoader from '../../../shared/components/PreLoader/PreLoader';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { formatDateToTR } from '../../../helpers/dateHelper';
import { defaultGroupPhoto } from '../../../constants/DefaultProfilePhoto';

function GroupDetailsBar({ isSidebarOpen, toggleSidebar, groupProfile }) {
    const { showModal, closeModal } = useModal();

    const [groupId, setGroupID] = useState(null);

    const { token } = useSelector((state) => state.auth);
    const decodedToken = token ? jwtDecode(token) : null;
    const userId = decodedToken?.sub;



    const isAdmin = userId &&
        groupProfile?.participants?.[userId] &&
        groupProfile?.participants[userId].role === 0;


    // Grup ayarlarını aç
    const handleGroupSettings = () => {
        showModal(<NewGroupModal closeModal={closeModal} isGroupSettings={true} groupInformation={groupProfile} groupId={groupId} userId={userId} />);
    };

    return (
        <div className={`group-details-sidebar ${isSidebarOpen ? "open" : ""}`}>
            {isSidebarOpen &&
                <>
                    <div className='option-buttons'>
                        <IoIosArrowDroprightCircle
                            className="sidebar-toggle-buttons"
                            onClick={toggleSidebar}
                        />
                        {isAdmin &&
                            <button className='group-setting-btn'>
                                <IoMdSettings
                                    onClick={handleGroupSettings}
                                />
                            </button>
                        }
                    </div>

                    <div className='sidebar-content-box'>
                        {/* Grup Bilgileri */}
                        {groupProfile ? (
                            <>
                                <div className='group-info-box'>
                                    <img src={defaultGroupPhoto} alt={`profile`} />
                                    <p>{groupProfile.name}</p>
                                </div>


                                <div className='date-box'>
                                    <p>{formatDateToTR(groupProfile.createdDate)} tarihinde oluşturuldu</p>
                                </div>

                                <div className='description'>
                                    <strong>Grup Açıklaması</strong>
                                    <div className='line'></div>
                                    <p>{groupProfile.description || "Açıklama bulunmuyor."}</p>
                                </div>

                                <div className="group-members-box">
                                    <h2>
                                        Grup Üyeleri - {Object.keys(groupProfile.participants).length}
                                    </h2>
                                    <div className="members-list">
                                        {Object.entries(groupProfile.participants)
                                            .sort(([, memberA], [, memberB]) => memberA.role - memberB.role) // Role değerine göre sıralama
                                            .map(([id, member]) => {
                                                const isOnline = member.lastConnectionDate == "0001-01-01T00:00:00";

                                                return (
                                                    <div key={id} className="member-box">
                                                        <div className="image-box">
                                                            <img
                                                                src={member.profilePhoto}
                                                                alt={member.displayName}
                                                            />
                                                            <p className={`user-status ${isOnline ? "online" : "offline"}`}></p>
                                                        </div>
                                                        <div className="user-info">
                                                            <p>{member.displayName}</p>
                                                            <span className={member.role === 0 ? "admin" : ""}>
                                                                {member.role === 0 ? "Yönetici" : "Üye"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>Grup bilgileri yükleniyor...</p>
                        )}
                    </div>
                </>
            }
        </div>
    );
}

export default GroupDetailsBar;
