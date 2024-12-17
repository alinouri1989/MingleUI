import { useEffect, useState } from "react";
import { useModal } from "../../../../contexts/ModalContext.jsx";
import CloseButton from "../../../../contexts/components/CloseModalButton.jsx";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader.jsx";
import star from "../../../../assets/svg/star.svg";
import { BiSearchAlt } from "react-icons/bi";
import { TiThList } from "react-icons/ti";
import { AiFillInfoCircle } from "react-icons/ai";
import { searchUsersApi, useSearchUsersQuery } from "../../../../store/Slices/searchUsers/searchUserApi.js";
import "./style.scss";
import { useDebounce } from "../../../../hooks/useDebounce.jsx";
import { useDispatch } from "react-redux";

function NewChatModal() {
  const { closeModal } = useModal();
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchQuery = useDebounce(inputValue, 300);
  const { data, error, isLoading, refetch } = useSearchUsersQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery,
  });

  const users = error ? [] : data ? Object.entries(data) : [];

  const handleGoToChat = (userId) => {
    console.log("Kullanıcı ID'si:", userId);

  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
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

      {/* Yükleme Durumu */}
      {isLoading && <PreLoader />}

      {users.length === 0 && error && !isLoading && (
        <div className="no-result-box active">
          <AiFillInfoCircle className="icon" />
          <p>{error?.data?.message || "Böyle bir kullanıcı bulunamadı"}</p>
        </div>
      )}

      {/* Kullanıcı Listesi */}
      {users.length > 0 && (
        <div className="user-list-box active">
          <div className="result-number-box">
            <TiThList className="icon" />
            <p>{users.length} kullanıcı listeleniyor</p>
          </div>

          {users &&
            <div className="users-box">
              {users.map(([userId, user]) => (
                <div
                  key={userId} // ID key olarak kullanıldı
                  className="user-box"
                  onClick={() => handleGoToChat(userId)} // ID parametre olarak gönderiliyor
                  style={{ cursor: "pointer" }} // Hover için pointer eklendi
                >
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.displayName} />
                  ) : (
                    <div className="default-profile-image">
                      <p>{user.displayName?.charAt(0) || "?"}</p>
                    </div>
                  )}
                  <div className="user-info">
                    <p>{user.displayName}</p>
                    <span>{user.email}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
}

export default NewChatModal;
