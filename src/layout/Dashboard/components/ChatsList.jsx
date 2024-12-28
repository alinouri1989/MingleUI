import React from "react";
import { useSelector } from "react-redux";
import NewChatModal from "../../../components/Chats/Components/NewChat/NewChatModal";
import { useModal } from "../../../contexts/ModalContext";
import SearchInput from "./SearchInput";
import UserChatCard from "./UserChatCard";
import "./style.scss";

function ChatsList() {
    const { showModal, closeModal } = useModal();
    const chatList = useSelector((state) => state.chatList.chatList);

    const handleNewChat = () => {
        showModal(<NewChatModal closeModal={closeModal} />);
    };

    return (
        <div className="chat-list-box">
            <SearchInput placeholder={"Sohbetlerinizde aratın..."} />
            <div>
                <button onClick={handleNewChat} className="create-buttons">Yeni Sohbet</button>
            </div>
            <div className="user-list">
                {Object.entries(chatList).map(([userId, user]) => (
                    <UserChatCard
                        key={userId}  // React'e key'i veriyoruz, userId'yi burada kullanabiliriz
                        userId={userId}  // userId'yi props olarak geçiriyoruz
                        image={user.profilePhoto}
                        status={user.connectionSettings?.lastConnectionDate === null}
                        name={user.displayName}
                        lastMessage={user.connectionSettings.lastMessage}
                        lastDate={user.connectionSettings.lastConnectionDate}
                        unReadMessage={user.connectionSettings.unReadMessage}
                        isArchive={user.isArchive}
                    />
                ))}
            </div>
        </div>
    );
}

export default ChatsList;
