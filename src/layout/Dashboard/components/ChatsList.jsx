import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NewChatModal from "../../../components/Chats/Components/NewChat/NewChatModal";
import { useModal } from "../../../contexts/ModalContext";
import SearchInput from "./SearchInput";
import UserChatCard from "./UserChatCard";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";
import { motion } from 'framer-motion';
import { TbMessagePlus } from "react-icons/tb";

import "./style.scss";
import { useLocation } from "react-router-dom";
import { getChatId } from "../../../store/Slices/chats/chatSlice";
import NoActiveData from "../../../shared/components/NoActiveData/NoActiveData";
import { opacityEffect } from "../../../shared/animations/animations";
import useScreenWidth from "../../../hooks/useScreenWidth";

function ChatsList() {
    const { showModal, closeModal } = useModal();
    const { Individual, isChatsInitialized } = useSelector((state) => state.chat);
    const chatList = useSelector((state) => state.chatList.chatList);
    const { token } = useSelector((state) => state.auth);
    const UserId = getUserIdFromToken(token);
    const [enhancedChatList, setEnhancedChatList] = useState([]);
    const chatState = useSelector(state => state.chat);
    const isSmallScreen = useScreenWidth(900);

    const [searchUser, setSearchUser] = useState("");

    const location = useLocation();

    useEffect(() => {
        const updatedChatList = Object.entries(chatList)
            .map(([receiverId, user]) => {
                const chatData = Individual.find(
                    (chat) =>
                        chat.participants.includes(receiverId) &&
                        chat.participants.includes(UserId)
                );

                const chatId = getChatId(chatState, UserId, receiverId);

                if (!chatData || !chatData.messages || chatData.messages.length === 0) {
                    return null;
                }

                // Eğer tüm mesajlar UserId için silinmişse, return etme
                const allMessagesDeleted = chatData?.messages.every(
                    (message) => message.deletedFor && Object.keys(message.deletedFor).length > 0 && message.deletedFor.hasOwnProperty(UserId)
                );
                if (allMessagesDeleted) {
                    return null;
                }

                const lastMessage = chatData?.messages[chatData?.messages.length - 1].content;

                const lastMessageForDeleted = chatData?.messages[chatData?.messages.length - 1];
                const isDeleted = lastMessageForDeleted?.deletedFor?.hasOwnProperty(UserId) ?? false;
                const lastMessageType = chatData?.messages[chatData?.messages.length - 1].type;

                const lastMessageDate =
                    chatData.messages.length > 0
                        ? lastMessageDateHelper(
                            Object.values(chatData.messages[chatData.messages.length - 1].status.sent)[0]
                        )
                        : "";

                const lastMessageDateForSort =
                    chatData.messages.length > 0
                        ? new Date(
                            Object.values(chatData.messages[chatData.messages.length - 1].status.sent)[0]
                        ).getTime()
                        : "";

                const isArchive = chatData.archivedFor?.hasOwnProperty(UserId);

                const isActiveChat = location.pathname.includes(chatId);

                const unReadMessage = !isActiveChat && chatData.messages.filter((message) => {
                    return (
                        !Object.keys(message.status.sent).includes(UserId) &&
                        !message.status.read?.[UserId]
                    );
                }).length;

                return {
                    receiverId,
                    image: user.profilePhoto,
                    status: user.lastConnectionDate === "0001-01-01T00:00:00",
                    name: user.displayName,
                    lastMessage,
                    lastMessageType,
                    lastMessageDate,
                    lastMessageDateForSort,
                    isArchive,
                    isDeleted,
                    unReadMessage
                };
            })
            .filter((chat) => chat !== null)
            .sort((a, b) => b.lastMessageDateForSort - a.lastMessageDateForSort);

        setEnhancedChatList(updatedChatList);
    }, [chatList, Individual, UserId, chatState]);


    const handleNewChat = () => {
        showModal(<NewChatModal closeModal={closeModal} />);
    };

    const nonArchivedChats = enhancedChatList.filter((chat) => !chat.isArchive);
    const filteredChats = nonArchivedChats.filter(chat =>
        chat.name.toLowerCase().includes(searchUser.toLowerCase())
    );

    return (
        <div className="chat-list-box">
            <SearchInput
                value={searchUser}
                onChange={setSearchUser}
                placeholder={"Sohbetlerinizde aratın..."}
            />

            <button onClick={handleNewChat} className="create-buttons">
                {isSmallScreen ? <TbMessagePlus /> : "Yeni Sohbet"}
            </button>

            <div className="list-flex">
                <motion.div
                    className="user-list"
                    variants={opacityEffect(0.8)}  // Opacity animasyonunu container için uyguladık
                    initial="initial"
                    animate="animate"
                >
                    {filteredChats.length > 0 ? (
                        filteredChats.map((chat) => (
                            <motion.div
                                key={chat.receiverId}
                                style={{ marginBottom: "10px" }}
                                variants={opacityEffect(0.8)}  // Opacity animasyonu her item için uygulanacak
                            >
                                <UserChatCard
                                    receiverId={chat.receiverId}
                                    image={chat.image}
                                    status={chat.status}
                                    name={chat.name}
                                    lastMessage={chat.lastMessage}
                                    lastMessageType={chat.lastMessageType}
                                    lastMessageDate={chat.lastMessageDate}
                                    isArchive={chat.isArchive}
                                    unReadMessage={chat.unReadMessage}
                                    isDeleted={chat.isDeleted}
                                />
                            </motion.div>
                        ))
                    ) : (
                        isChatsInitialized && <NoActiveData text={searchUser ? "Eşleşen kullanıcı bulunamadı" : "Aktif sohbet bulunamadı"} />

                    )}
                </motion.div>
            </div>

        </div>
    );
}

export default ChatsList;
