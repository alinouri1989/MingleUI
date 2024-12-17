import { useState } from "react";
import { useModal } from "../../../../contexts/ModalContext.jsx";
import CloseButton from "../../../../contexts/components/CloseModalButton.jsx";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader.jsx";
import star from "../../../../assets/svg/star.svg";
import { BiSearchAlt } from "react-icons/bi";
import { TiThList } from "react-icons/ti";
import { AiFillInfoCircle } from "react-icons/ai";
import { useSearchUsersQuery } from "../../../../store/Slices/searchUsers/searchUserApi.js";
import { useDebounce } from "../../../../hooks/useDebounce.jsx";
import "./style.scss";


function NewChatModal() {

  const { closeModal } = useModal();
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchQuery = useDebounce(inputValue, 300);

  const { data, error, isFetching } = useSearchUsersQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery,
  });

  const users = error ? [] : data ? Object.entries(data) : [];

  const handleGoToChat = (userId) => {

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
      {isFetching && <PreLoader />}

      {users.length === 0 && error && !isFetching && (
        <div className="no-result-box active">
          <AiFillInfoCircle className="icon" />
          <p>{error?.data?.message || "Böyle bir kullanıcı bulunamadı"}</p>
        </div>
      )}

      {/* Kullanıcı Listesi */}
      {!isFetching && users.length > 0 && (
        <div className="user-list-box active">
          <div className="result-number-box">
            <TiThList className="icon" />
            <p>{users.length} kullanıcı listeleniyor</p>
          </div>

          {users &&
            <div className="users-box">
              {users.map(([userId, user]) => (
                <div
                  key={userId}
                  className="user-box"
                  onClick={() => handleGoToChat(userId)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={user.profilePhoto} alt={user.displayName} />
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
