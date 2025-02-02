import React, { useEffect, useState } from "react";
import UserChatCard from "./UserChatCard";
import { useSelector } from "react-redux";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";
import SearchInput from "./SearchInput";
import { useLocation } from "react-router-dom";
import { getChatId } from "../../../store/Slices/chats/chatSlice";
import NoActiveData from "../../../shared/components/NoActiveData/NoActiveData";
import "./style.scss";


function ArchivesList() {

    const { Individual } = useSelector((state) => state.chat);
    const chatList = useSelector((state) => state.chatList.chatList);
    const { token } = useSelector((state) => state.auth);
    const UserId = getUserIdFromToken(token);
    const location = useLocation();
    const chatState = useSelector(state => state.chat);
    const [searchUser, setSearchUser] = useState("");

    const [enhancedChatList, setEnhancedChatList] = useState([]);

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

                const lastMessage = chatData?.messages[chatData?.messages.length - 1].content
                const lastMessageForDeleted = chatData?.messages[chatData?.messages.length - 1].content
                const isDeleted = lastMessageForDeleted?.deletedFor?.hasOwnProperty(UserId) ?? false;

                const lastMessageType = chatData?.messages[chatData?.messages.length - 1].type;

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

                // URL'deki chatId'yi kontrol et
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
                    lastMessageDate,
                    lastMessageType,
                    lastMessageDateForSort,
                    isArchive,
                    isDeleted,
                    unReadMessage
                };
            })
            .filter((chat) => chat !== null)
            .sort((a, b) => b.lastMessageDateForSort - a.lastMessageDateForSort);

        setEnhancedChatList(updatedChatList);
    }, [chatList, Individual, UserId]);

    const archivedChats = enhancedChatList.filter((chat) => chat.isArchive);
    const filteredChats = archivedChats.filter(chat =>
        chat.name.toLowerCase().includes(searchUser.toLowerCase())
    );

    return (
        <div className="archive-list-box">
            <SearchInput value={searchUser} onChange={setSearchUser} placeholder={"Arşivlenmiş sohbetlerde ara"} />
            <div className="user-list">
                {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                        <UserChatCard
                            key={chat.receiverId}
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
                    ))
                ) : (
                    <NoActiveData text={searchUser ? "Eşleşen kullanıcı bulunamadı" : "Arşivlenmiş sohbetiniz bulunmamaktadır."} />
                )}
            </div>
        </div>
    )
}

export default ArchivesList