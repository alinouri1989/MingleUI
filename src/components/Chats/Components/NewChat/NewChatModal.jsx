import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../../hooks/useDebounce.jsx";
import { useSignalR } from "../../../../contexts/SignalRContext.jsx";
import { useModal } from "../../../../contexts/ModalContext.jsx";

import { BiSearchAlt } from "react-icons/bi";
import { TiThList } from "react-icons/ti";
import { AiFillInfoCircle } from "react-icons/ai";
import star from "../../../../assets/svg/star.svg";

import CloseButton from "../../../../contexts/components/CloseModalButton.jsx";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader.jsx";
import { getUserIdFromToken } from "../../../../helpers/getUserIdFromToken.js";
import { ErrorAlert } from "../../../../helpers/customAlert.js";
import { opacityEffect } from "../../../../shared/animations/animations.js";

import { motion } from "framer-motion";
import "./style.scss";
import { defaultProfilePhoto } from "../../../../constants/DefaultProfilePhoto.js";


function NewChatModal() {

  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [isCreater, setIsCreater] = useState(false);
  const { notificationConnection, chatConnection, connectionStatus } = useSignalR();

  const [inputValue, setInputValue] = useState("");
  const debouncedSearchQuery = useDebounce(inputValue, 300);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    if (!notificationConnection || !debouncedSearchQuery) return;

    setLoading(true);
    setError(null);

    const handleReceiveSearchUsers = (response) => {
      if (!response || response.query !== debouncedSearchQuery) return;

      const formattedUsers = Object.entries(response.data || {}).map(([id, user]) => ({
        userId: id,
        ...user,
      }));

      if (formattedUsers.length === 0) {
        setError("Böyle bir kullanıcı bulunamadı.");
      }

      setUsers(formattedUsers);
      setLoading(false);
    };

    notificationConnection.off("ReceiveSearchUsers");

    notificationConnection.on("ReceiveSearchUsers", handleReceiveSearchUsers);

    notificationConnection
      .invoke("SearchUsers", debouncedSearchQuery)
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    return () => {
      notificationConnection.off("ReceiveSearchUsers", handleReceiveSearchUsers);
    };
  }, [debouncedSearchQuery, notificationConnection]);

  useEffect(() => {
    if (!isCreater) return;

    const handleReceiveCreateChat = (response) => {
      const individualData = response?.Individual;
      if (individualData) {
        const chatId = Object.keys(individualData)[0];
        if (chatId) {
          const chatData = individualData[chatId];
          const isArchived = chatData.archivedFor && Object.prototype.hasOwnProperty.call(chatData.archivedFor, userId);

          const destination = isArchived ? `/arsivler/${chatId}` : `/sohbetler/${chatId}`;
          navigate(destination);
          closeModal();
        } else {
          ErrorAlert("Bir hata meydana geldi");
        }
      } else {
        ErrorAlert("Bir hata meydana geldi");
      }
    };

    if (chatConnection) {
      chatConnection.on("ReceiveCreateChat", handleReceiveCreateChat);
    }

    return () => {
      if (chatConnection) {
        chatConnection.off("ReceiveCreateChat", handleReceiveCreateChat);
      }
    };
  }, [chatConnection, isCreater, navigate, closeModal, userId]);
  
  const handleGoToChat = async (userId) => {
    if (connectionStatus !== "connected") {
      ErrorAlert("Bir hata meydana geldi");
      return;
    }
    try {
      setIsCreater(true);
      await chatConnection.invoke("CreateChat", "Individual", userId);
    } catch {
      ErrorAlert("Bir hata meydana geldi");
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
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      {loading && <PreLoader />}

      {error && !loading && (
        <motion.div
          variants={opacityEffect(0.8)}
          initial="initial"
          animate="animate"
          className="no-result-box active">
          <AiFillInfoCircle className="icon" />
          <p>{error}</p>
        </motion.div>
      )}

      {!loading && users.length > 0 && (
        <div className="user-list-box active">
          <div className="result-number-box">
            <TiThList className="icon" />
            <p>{users.length} kullanıcı listeleniyor</p>
          </div>

          <div className="users-box">
            {users.map((user) => (
              <motion.div
                key={user.userId}
                className="user-box"
                onClick={() => handleGoToChat(user.userId)}
                style={{ cursor: "pointer" }}
                variants={opacityEffect(0.8)}
                initial="initial"
                animate="animate"
              >
                <img src={user.profilePhoto}
                  onError={(e) => e.currentTarget.src = defaultProfilePhoto}
                  alt={user.displayName}
                />
                <div className="user-info">
                  <p>{user.displayName}</p>
                  <span>{user.email}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NewChatModal;