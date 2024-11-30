
import { MdClose } from 'react-icons/md';

import { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { HiCheckCircle } from "react-icons/hi2";


import star from "../../../assets/svg/star.svg";
import { BiSearchAlt } from "react-icons/bi";
import { TiThList } from "react-icons/ti";
import Okan from "../../../assets/users/okan.png";
import { AiFillInfoCircle } from "react-icons/ai";


import "../../Chats/Components/NewChat/style.scss";

function AddUser({ closeUserModal }) {

    const resultNumber = 4;
    const isProfilPhoto = false;
    const isUserAdded = true;

    const [inputValue, setInputValue] = useState("");
    const [showUsersBox, setShowUsersBox] = useState(false);
    const [showNoResult, setShowNoResult] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value === ".") {
            setShowUsersBox(false);
            setShowNoResult(true);
        } else if (value.length > 0) {
            setShowUsersBox(true);
            setShowNoResult(false);
        } else {
            setShowUsersBox(false);
            setShowNoResult(false);
        }
    };

    const handleAddSelectedUser = () => {

    }

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

                    {/* Conditional Rendering for No Result Box */}
                    <div className={`no-result-box ${showNoResult ? "active" : ""}`}>
                        <AiFillInfoCircle className="icon" />
                        <p>Böyle bir kullanıcı bulunamadı</p>
                    </div>

                    {/* Conditional Rendering for Users Box */}
                    <div className={`user-list-box ${showUsersBox ? "active" : ""}`}>
                        <div className="result-number-box">
                            <TiThList className="icon" />
                            <p>{resultNumber} kullanıcı listeleniyor</p>
                        </div>

                        <div className="users-box">
                            <div onClick={handleAddSelectedUser} className="user-box">
                                <img src={Okan} alt="User Img" />
                                <div className="user-info">
                                    <p>Okan Doğan</p>
                                    <span>okandogan20@gmail.com</span>
                                </div>
                                {isUserAdded ?
                                    <div className='added-user'>
                                        <p>Eklendi</p>
                                        <HiCheckCircle className='icon' />
                                    </div> : <div className='add-user-box'>
                                        <HiUserAdd className='icon' />
                                        <p>Ekle</p>
                                    </div>
                                }
                            </div>

                            <div className="user-box">
                                {isProfilPhoto ? (
                                    <img src={Okan} alt="User Img" />
                                ) : (
                                    <div className="default-profile-image">
                                        <p>OK</p>
                                    </div>
                                )}
                                <div className="user-info">
                                    <p>Okan Doğan</p>
                                    <span>okndoganlar77@outlook.com</span>
                                </div>
                                <div className='add-user-box'>
                                    <HiUserAdd className='icon' />
                                    <p>Ekle</p>
                                </div>
                            </div>

                            <div className="user-box">
                                {isProfilPhoto ? (
                                    <img src={Okan} alt="User Img" />
                                ) : (
                                    <div className="default-profile-image">
                                        <p>OK</p>
                                    </div>
                                )}
                                <div className="user-info">
                                    <p>Okan Doğan</p>
                                    <span>okandogan01@hotmail.com</span>
                                </div>
                                <div className='add-user-box'>
                                    <HiUserAdd className='icon' />
                                    <p>Ekle</p>
                                </div>
                            </div>

                            <div className="user-box">
                                {isProfilPhoto ? (
                                    <img src={Okan} alt="User Img" />
                                ) : (
                                    <div className="default-profile-image">
                                        <p>OKA</p>
                                    </div>
                                )}
                                <div className="user-info">
                                    <p>Okan Doğan Aslan</p>
                                    <span>okandgnasln33@hotmail.com</span>
                                </div>
                                <div className='add-user-box'>
                                    <HiUserAdd className='icon' />
                                    <p>Ekle</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUser