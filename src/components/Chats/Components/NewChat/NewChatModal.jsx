import React, { useState } from "react";
import { useModal } from "../../../../contexts/ModalContext.jsx";
import CloseButton from "../../../../contexts/components/CloseModalButton.jsx";

import star from "../../../../assets/svg/star.svg";
import { BiSearchAlt } from "react-icons/bi";
import { TiThList } from "react-icons/ti";
import Okan from "../../../../assets/users/okan.png";
import { AiFillInfoCircle } from "react-icons/ai";

import "./style.scss";

function NewChatModal() {
  // This Component is not full modular. But It will be more effective
  const { closeModal } = useModal();
  const resultNumber = 4;
  const isProfilPhoto = false;

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

  return (
    <div className="new-chat-modal">
      <CloseButton closeModal={closeModal} />
      <div className="title-and-input-bar">
        <div className="title-box">
          <img src={star} alt="" />
          <p>Yeni bir sohbet başlat</p>
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
          <div className="user-box">
            <img src={Okan} alt="User Img" />
            <div className="user-info">
              <p>Okan Doğan</p>
              <span>okandogan20@gmail.com</span>
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
              <span>okndoganlar77@outlook.com</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewChatModal;
