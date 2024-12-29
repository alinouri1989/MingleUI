import React from "react";
import { useSelector } from "react-redux";
import NewChatModal from "../../../components/Chats/Components/NewChat/NewChatModal";
import { useModal } from "../../../contexts/ModalContext";
import SearchInput from "./SearchInput";
import UserChatCard from "./UserChatCard";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import "./style.scss";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";
import NoChats from "../../../assets/NoChats.webp";


function ChatsList() {
    const { showModal, closeModal } = useModal();
    const { Individual } = useSelector((state) => state.chat); // Chat bilgileri
    const chatList = useSelector((state) => state.chatList.chatList); // Orijinal chatList
    const { token } = useSelector((state) => state.auth); // Kullanıcı token'ı
    const UserId = getUserIdFromToken(token); // Token'dan kullanıcı ID'si al

    // Individual üzerinden lastMessageDate ve lastMessage güncelleme
    const enhancedChatList = Object.entries(chatList)
        .map(([userId, user]) => {
            // Individual'da eşleşen chat'i bul
            const chatData = Individual.find(
                (chat) =>
                    chat.participants.includes(userId) && chat.participants.includes(UserId)
            );

            // Eğer chatData veya chatData.messages boşsa, bu kullanıcıyı listelemeye alma
            if (!chatData || !chatData.messages || chatData.messages.length === 0) {
                return null; // Bu kullanıcıyı liste dışı bırak
            }

            const lastMessage =
                chatData.messages.length > 0
                    ? chatData.messages[chatData.messages.length - 1].content
                    : user.connectionSettings.lastMessage;

            const lastMessageDate =
                chatData.messages.length > 0
                    ? lastMessageDateHelper(
                        Object.values(chatData.messages[chatData.messages.length - 1].status.sent)[0]
                    )
                    : user.connectionSettings.lastConnectionDate;

            return {
                userId,
                image: user.profilePhoto,
                status: user.connectionSettings?.lastConnectionDate === null,
                name: user.displayName,
                lastMessage,
                lastMessageDate,
                unReadMessage: user.connectionSettings.unReadMessage,
                isArchive: user.isArchive,
            };
        })
        .filter((chat) => chat !== null);

    const handleNewChat = () => {
        showModal(<NewChatModal closeModal={closeModal} />);
    };

    return (
        <div className="chat-list-box">
            <SearchInput placeholder={"Sohbetlerinizde aratın..."} />
            <div>
                <button onClick={handleNewChat} className="create-buttons">
                    Yeni Sohbet
                </button>
            </div>
            <div className="user-list">
                {enhancedChatList.length > 0 ? (
                    enhancedChatList.map((chat) => (
                        <UserChatCard
                            key={chat.userId}
                            userId={chat.userId}
                            image={chat.image}
                            status={chat.status}
                            name={chat.name}
                            lastMessage={chat.lastMessage}
                            lastMessageDate={chat.lastMessageDate}
                            unReadMessage={chat.unReadMessage}
                            isArchive={chat.isArchive}
                        />
                    ))
                ) : (
                    <div className="no-active-chats">
                        <img src={NoChats} alt="" />
                        <p>Aktif sohbet bulunmuyor...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatsList;
