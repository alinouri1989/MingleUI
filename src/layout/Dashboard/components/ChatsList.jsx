import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useModal } from "../../../contexts/ModalContext";

import NewChatModal from "../../../components/Chats/Components/NewChat/NewChatModal";
import SearchInput from "./SearchInput";
import UserChatCard from "./UserChatCard";

import { getChatId } from "../../../store/Slices/chats/chatSlice";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";

import NoActiveData from "../../../shared/components/NoActiveData/NoActiveData";
import PreLoader from "../../../shared/components/PreLoader/PreLoader";
import { opacityEffect } from "../../../shared/animations/animations";
import useScreenWidth from "../../../hooks/useScreenWidth";

import { TbMessagePlus } from "react-icons/tb";
import { motion } from 'framer-motion';
import "./style.scss";

function ChatsList() {

    const { showModal, closeModal } = useModal();
    const { Individual, isChatsInitialized } = useSelector((state) => state.chat);
    const chatList = useSelector((state) => state.chatList.chatList);

    const { token } = useSelector((state) => state.auth);
    const UserId = getUserIdFromToken(token);

    const [searchUser, setSearchUser] = useState("");
    const [enhancedChatList, setEnhancedChatList] = useState([]);

    const chatState = useSelector(state => state.chat);
    const isSmallScreen = useScreenWidth(900);

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

                const allMessagesDeleted = chatData.messages.every(
                    (message) =>
                        message.deletedFor &&
                        Object.keys(message.deletedFor).length > 0 &&
                        message.deletedFor.hasOwnProperty(UserId)
                );
                if (allMessagesDeleted) {
                    return null;
                }

                let lastMessageObj = [...chatData.messages].reverse().find(
                    (message) => !message.deletedFor?.hasOwnProperty(UserId)
                );

                const lastMessage = lastMessageObj?.content;

                const lastMessageType = lastMessageObj?.type;
                const lastMessageDate = lastMessageObj
                    ? lastMessageDateHelper(Object.values(lastMessageObj.status.sent)[0])
                    : "";
                const lastMessageDateForSort = lastMessageObj
                    ? new Date(Object.values(lastMessageObj.status.sent)[0]).getTime()
                    : "";

                const isArchive = chatData.archivedFor?.hasOwnProperty(UserId);
                const isActiveChat = location.pathname.includes(chatId);

                const unReadMessage =
                    !isActiveChat &&
                    chatData.messages.filter(
                        (message) =>
                            !Object.keys(message.status.sent).includes(UserId) &&
                            !message.status.read?.[UserId] &&
                            !message.deletedFor?.hasOwnProperty(UserId)
                    ).length;

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
                    isDeleted: lastMessageObj?.deletedFor?.hasOwnProperty(UserId) ?? false,
                    unReadMessage,
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
            {isSmallScreen && <h2 className="mobil-menu-title">Sohbetler</h2>}
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
                    variants={opacityEffect(0.8)}
                    initial="initial"
                    animate="animate"
                >
                    {filteredChats.length > 0 ? (
                        filteredChats.map((chat) => (
                            <motion.div
                                key={chat.receiverId}
                                style={{ marginBottom: "10px" }}
                                variants={opacityEffect(0.8)}
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
                        isChatsInitialized
                            ? <NoActiveData text={searchUser ? "Eşleşen kullanıcı bulunamadı" : "Aktif sohbet bulunamadı"} />
                            : <PreLoader />
                    )}
                </motion.div>
            </div>

        </div>
    );
}

export default ChatsList;
