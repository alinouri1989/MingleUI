import { useEffect, useState } from "react";
import { useModal } from "../../../../contexts/ModalContext.jsx";
import { useNavigate } from 'react-router-dom';


import CloseButton from "../../../../contexts/components/CloseModalButton.jsx";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader.jsx";
import star from "../../../../assets/svg/star.svg";
import { BiSearchAlt } from "react-icons/bi";
import { TiThList } from "react-icons/ti";
import { AiFillInfoCircle } from "react-icons/ai";
import { useSearchUsersQuery } from "../../../../store/Slices/searchUsers/searchUserApi.js";
import { useDebounce } from "../../../../hooks/useDebounce.jsx";
import { useSignalR } from "../../../../contexts/SignalRContext.jsx";
import "./style.scss";
import { addNewIndividualChat } from "../../../../store/Slices/chats/chatSlice.js";
import { useDispatch } from "react-redux";

function NewChatModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { chatConnection, connectionStatus } = useSignalR();
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchQuery = useDebounce(inputValue, 300);

  const { data, error, isFetching } = useSearchUsersQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery,
  });

  const users = error ? [] : data ? Object.entries(data) : [];


  useEffect(() => {
    const handleReceiveCreateChat = (response) => {
      console.log("ReceiveCreateChat yanıtı:", response);

      const individualData = response?.Individual;
      if (individualData) {
        const chatId = Object.keys(individualData)[0];
        if (chatId) {
          console.log("Yeni sohbet oluşturuldu, Chat ID:", chatId);
          navigate(`/sohbetler/${chatId}`);
          closeModal();
        } else {
          console.error("Chat ID alınamadı:", response);
        }
      } else {
        console.error("Individual bilgisi bulunamadı:", response);
      }
    };

    if (chatConnection) {
      chatConnection.on("ReceiveCreateChat", handleReceiveCreateChat);
    }

    // Cleanup - Event listener'ı kaldırma
    return () => {
      if (chatConnection) {
        chatConnection.off("ReceiveCreateChat", handleReceiveCreateChat);
      }
    };
  }, [chatConnection]);

  const handleGoToChat = async (userId) => {
    if (connectionStatus !== "connected") {
      console.error("Bağlantı henüz kurulmadı.");
      return;
    }

    try {
      const chatType = "Individual";
      await chatConnection.invoke("CreateChat", chatType, userId);
      console.log("CreateChat talebi gönderildi.");
    } catch (err) {
      console.error("CreateChat isteği sırasında hata:", err);
    }
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