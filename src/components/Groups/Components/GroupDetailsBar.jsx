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

function GroupDetailsBar({ isSidebarOpen, toggleSidebar, chatId }) {
    const { showModal, closeModal } = useModal();
    const { data, isLoading ,refetch } = useGetGroupProfileQuery(chatId);

    const [groupInformation, setGroupInformation] = useState(null);
    const [groupId, setGroupID] = useState(null);


        const { token } = useSelector((state) => state.auth);
        const decodedToken = token ? jwtDecode(token) : null;
        const userId = decodedToken?.sub;

        useEffect(() => {
            if (data) {
                const groupData = Object.values(data)[0];
                const firstKey = Object.keys(data)[0];
                setGroupID(firstKey);
                setGroupInformation(groupData);
            }
        }, [data]);

        const isAdmin = userId &&
            groupInformation?.participants?.[userId] &&
            groupInformation.participants[userId].Role === 0;

        // Grup ayarlarını aç
        const handleGroupSettings = () => {
            showModal(<NewGroupModal closeModal={closeModal} isGroupSettings={true} groupInformation={groupInformation} groupId={groupId} userId={userId} refetch={refetch}/>);
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
                            {groupInformation ? (
                                <>
                                    <div className='group-info-box'>
                                        <img src={groupInformation.photoUrl} alt={`profile`} />
                                        <p>{groupInformation.name}</p>
                                    </div>

                                    <div className='date-box'>
                                        <p>{formatDateToTR(groupInformation.createdDate)} tarihinde oluşturuldu</p>
                                    </div>

                                    <div className='description'>
                                        <strong>Grup Açıklaması</strong>
                                        <div className='line'></div>
                                        <p>{groupInformation.description || "Açıklama bulunmuyor."}</p>
                                    </div>

                                    {/* Üyeler */}
                                    <div className='group-members-box'>
                                        <h2>Grup Üyeleri - {Object.keys(groupInformation.participants || {}).length}</h2>
                                        <div className='members-list'>
                                            {Object.entries(groupInformation.participants || {})
                                                .sort(([, memberA], [, memberB]) => memberA.Role - memberB.Role) // Role değerine göre sıralama
                                                .map(([id, member]) => (
                                                    <div key={id} className='member-box'>
                                                        <div className="image-box">
                                                            <img src={member.ProfilePhoto} alt={member.DisplayName} />
                                                            <p className={`user-status ${id === userId ? "active" : ""}`}></p>
                                                        </div>
                                                        <div className='user-info'>
                                                            <p>{member.DisplayName}</p>
                                                            <span className={member.Role === 0 ? "admin" : ""}>
                                                                {member.Role === 0 ? "Yönetici" : "Üye"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                    </div>
                                </>
                            ) : (
                                <p>Grup bilgileri yükleniyor...</p>
                            )}
                        </div>
                    </>
                }
                {isLoading && <PreLoader />}
            </div>
        );
    }

export default GroupDetailsBar;
