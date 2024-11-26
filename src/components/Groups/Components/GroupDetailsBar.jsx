import React from 'react';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import YardimlasmaGrubu from "../../../assets/YardimlasmaGrubu.png";
import Hamza from "../../../assets/users/hamza.png";

function GroupDetailsBar({ isSidebarOpen, toggleSidebar, groupDetails }) {
    const isAdmin = true;

    // Grup üyelerini bir dizi olarak tanımladık
    const groupMembers = [
        { id: 1, name: "Hamza Doğan", status: "online", isAdmin: true, avatar: Hamza },
        { id: 2, name: "Ahmet Yılmaz", status: "online", isAdmin: false, avatar: Hamza },
        { id: 3, name: "Fatma Kaya", status: "offline", isAdmin: false, avatar: Hamza },
        { id: 5, name: "Zeynep Çelik", status: "offline", isAdmin: false, avatar: Hamza },
        { id: 6, name: "Ferhan Hacısalih", status: "offline", isAdmin: false, avatar: Hamza },
        { id: 7, name: "Nazmi Koçak", status: "offline", isAdmin: false, avatar: Hamza },
        { id: 8, name: "Nazmi Koçak", status: "offline", isAdmin: false, avatar: Hamza },
        { id: 9, name: "Nazmi Koçak", status: "offline", isAdmin: false, avatar: Hamza },

        // Daha fazla üye ekleyebilirsiniz
    ];

    const handleGroupSettings = () => {
        console.log("Grup ayarları açılır.")
    }

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
                        <div className='group-info-box'>
                            <img src={YardimlasmaGrubu} alt={`profile`} />
                            <p>Yardımlaşma Grubu</p>
                        </div>

                        <div className='description'>
                            <strong>Grup Açıklaması</strong>
                            <div className='line'></div>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores id vitae corporis ex, atque animi distinctio minima commodi explicabo qui?</p>
                        </div>
                        <div className='group-members-box'>
                            <h2>Grup Üyeleri - {groupMembers.length}</h2>
                            <div className='members-list'>
                                {groupMembers.map(member => (
                                    <div key={member.id} className='member-box'>
                                        <div className="image-box">
                                            <img src={member.avatar} alt={member.name} />
                                            <p className={`user-status ${member.status}`}></p>
                                        </div>
                                        <div className='user-info'>
                                            <p>{member.name}</p>
                                            <span className={member.isAdmin ? "admin" : ""}>
                                                {member.isAdmin ? "Yönetici" : "Üye"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                </>
            }
        </div>
    );
}

export default GroupDetailsBar;
