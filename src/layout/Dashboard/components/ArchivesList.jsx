import React, { useEffect, useState } from "react";
import UserChatCard from "./UserChatCard";
import { useSelector } from "react-redux";
import NewChatModal from "../../../components/Chats/Components/NewChat/NewChatModal";
import { useModal } from "../../../contexts/ModalContext";
import SearchInput from "./SearchInput";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";
import NoChats from "../../../assets/NoChats.webp";
import "./style.scss";


function ArchivesList() {

    const { showModal, closeModal } = useModal();
    const { Individual } = useSelector((state) => state.chat);
    const chatList = useSelector((state) => state.chatList.chatList); // Orijinal chatList
    const { token } = useSelector((state) => state.auth); // Kullanıcı token'ı
    const UserId = getUserIdFromToken(token); // Token'dan kullanıcı ID'si al


    const [enhancedChatList, setEnhancedChatList] = useState([]);

    useEffect(() => {
        const updatedChatList = Object.entries(chatList)
            .map(([userId, user]) => {
                const chatData = Individual.find(
                    (chat) =>
                        chat.participants.includes(userId) &&
                        chat.participants.includes(UserId)
                );

                if (!chatData || !chatData.messages || chatData.messages.length === 0) {
                    return null;
                }

                const lastMessage = chatData?.messages[chatData?.messages.length - 1].content


                const lastMessageDate =
                    chatData.messages.length > 0
                        ? lastMessageDateHelper(
                            Object.values(chatData.messages[chatData.messages.length - 1].status.sent)[0]
                        )
                        : "";

                // Tarih sıralama için kullanılacak
                const lastMessageDateForSort =
                    chatData.messages.length > 0
                        ? new Date(
                            Object.values(chatData.messages[chatData.messages.length - 1].status.sent)[0]
                        ).getTime()
                        : "";

                const isArchive = chatData.archivedFor?.hasOwnProperty(UserId);

                return {
                    userId,
                    image: user.profilePhoto,
                    status: user.lastConnectionDate === "0001-01-01T00:00:00",
                    name: user.displayName,
                    lastMessage,
                    lastMessageDate,
                    lastMessageDateForSort,
                    isArchive
                };
            })
            .filter((chat) => chat !== null)
            .sort((a, b) => b.lastMessageDateForSort - a.lastMessageDateForSort);

        setEnhancedChatList(updatedChatList);
    }, [chatList, Individual, UserId]);

    const archivedChats = enhancedChatList.filter((chat) => chat.isArchive);

    return (
        <div className="archive-list-box">
            <SearchInput placeholder={"Arşivlenmiş sohbetlerde ara"} />
            <div className="user-list">
                {archivedChats.length > 0 ? (
                    archivedChats.map((chat) => (
                        <UserChatCard
                            key={chat.userId}
                            receiverId={chat.userId}
                            image={chat.image}
                            status={chat.status}
                            name={chat.name}
                            lastMessage={chat.lastMessage}
                            lastMessageDate={chat.lastMessageDate}
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
    )
}

export default ArchivesList