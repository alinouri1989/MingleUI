import { MdClose } from 'react-icons/md';
import { HiUserAdd } from "react-icons/hi";
import { HiCheckCircle } from "react-icons/hi2";
import star from "../../../assets/svg/star.svg";
import { BiSearchAlt } from "react-icons/bi";
import { TiThList } from "react-icons/ti";
import { AiFillInfoCircle } from "react-icons/ai";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Okan from "../../../assets/users/okan.png";
import "../../Chats/Components/NewChat/style.scss";
import { useDebounce } from '../../../hooks/useDebounce';
import { useSearchUsersQuery } from '../../../store/Slices/searchUsers/searchUserApi';
import PreLoader from '../../../shared/components/PreLoader/PreLoader';
import { ErrorAlert, SuccessAlert } from '../../../helpers/customAlert';

function AddUser({ closeUserModal, setFormData, formData }) {


    const [inputValue, setInputValue] = useState("");
    const debouncedSearchQuery = useDebounce(inputValue, 300);
    const { data, error, isFetching } = useSearchUsersQuery(debouncedSearchQuery, {
        skip: !debouncedSearchQuery,
    });

    const users = error ? [] : data ? Object.entries(data) : [];

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddSelectedUser = (userId) => {
        const selectedUser = users.find(([id, user]) => id === userId);

        if (!formData.participants || !formData.participants[userId]) {
            // Kullanıcı daha önce eklenmemişse yeni olarak ekliyoruz
            console.log(selectedUser);
            setFormData((prevState) => ({
                ...prevState,
                participants: {
                    ...prevState.participants,
                    [userId]: {
                        displayName: selectedUser[1].displayName,
                        role: 1, // Yeni kullanıcıyı rolü 1 olarak ekliyoruz
                        profilePhoto: selectedUser[1].profilePhoto,
                    }
                }
            }));

            SuccessAlert("Kullanıcı Eklendi", 1000);
        } else {
            // Kullanıcı zaten var
            const currentRole = formData.participants[userId].role;

            if (currentRole === 2) {
                const updatedParticipants = { ...formData.participants };
                updatedParticipants[userId] = {
                    ...updatedParticipants[userId],
                    role: 1
                };

                setFormData((prevState) => ({
                    ...prevState,
                    participants: updatedParticipants
                }));

                SuccessAlert("Kullanıcı eklendi.", 1000);
            } else if (currentRole === 1 || currentRole === 0) {
                // Eğer rolü zaten 1 ya da 0 ise, kullanıcı zaten ekli
                ErrorAlert("Bu kullanıcı zaten eklendi.", 1500);
            }
        }
    };

    return (
        <div className='add-user-modal'>
            <div className="fullsize-overlay">
                <div className="card">
                    <button onClick={closeUserModal} className='modal-close'><MdClose /></button>
                    <div className="title-and-input-bar">
                        <div className="title-box">
                            <img src={star} alt="" />
                            <p>Üye Ekle</p>
                        </div>
                        <div className="search-user-input-box">
                            <BiSearchAlt className="icon" />
                            <input
                                type="text"
                                placeholder="Kullanıcı adı veya email ile aratın..."
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Yükleniyor durumu */}
                    {isFetching && <PreLoader />}

                    {/* Sonuç bulunamadığında hata mesajı */}
                    {users.length === 0 && error && !isFetching && (
                        <div className="no-result-box active">
                            <AiFillInfoCircle className="icon" />
                            <p>{error?.data?.message || "Böyle bir kullanıcı bulunamadı"}</p>
                        </div>
                    )}

                    {/* Kullanıcıları listeleme */}
                    {!isFetching && users.length > 0 && (
                        <div className="user-list-box active">
                            <div className="result-number-box">
                                <TiThList className="icon" />
                                <p>{users.length} kullanıcı listeleniyor</p>
                            </div>
                            <div className="users-box">
                                {users.map(([userId, user]) => {
                                    // formData'dan participants içinde userId kontrolü yapıyoruz
                                    const isAlreadyAdded = formData.participants && formData.participants[userId];
                                    const userRole = isAlreadyAdded ? formData.participants[userId].role : null;

                                    return (
                                        <div key={userId} className="user-box" onClick={() => handleAddSelectedUser(userId)}>
                                            <img src={user.profilePhoto || Okan} alt={user.displayName} />
                                            <div className="user-info">
                                                <p>{user.displayName}</p>
                                                <span>{user.email}</span>
                                            </div>
                                            <div className='add-user-box'>
                                                {isAlreadyAdded ? (
                                                    <>
                                                        {userRole === 2 ? (
                                                            null
                                                        ) : (
                                                            <>
                                                                <HiCheckCircle className='icon' />
                                                                <p>Eklendi</p>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiUserAdd className='icon' />
                                                        <p>Ekle</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddUser;
