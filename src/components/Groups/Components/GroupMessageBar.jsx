import React, { useRef } from 'react'
import MessageBubble from "../../../shared/components/MessageBubble/MessageBubble.jsx";
import { useSelector } from 'react-redux';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';
import { useEffect } from 'react';
import { getUserIdFromToken } from '../../../helpers/getUserIdFromToken.js';
import { convertToLocalTime } from '../../../helpers/convertToLocalTime.js';

function GroupMessageBar({ groupId }) {

    const { user, token } = useSelector((state) => state.auth);


    const { Group } = useSelector((state) => state.chat);
    const { groupList } = useSelector((state) => state.groupList);
    const currentUserId = getUserIdFromToken(token);

    const GroupChat = Group?.find(group => group?.id === groupId);
    console.log("GroupChatbilgisi", GroupChat);
    const backgroundImage = getChatBackgroundColor(user.userSettings.chatBackground)
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [GroupChat?.messages]);

    const groupedMessagesByDate = GroupChat?.messages?.reduce((acc, message) => {
        const sentDate = Object.values(message?.status?.sent)[0];
        const date = sentDate ? sentDate.split("T")[0] : "Geçersiz Tarih";

        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        let groupLabel;
        if (date === today) {
            groupLabel = "Bugün";
        } else if (date === yesterday) {
            groupLabel = "Dün";
        } else {
            groupLabel = date;
        }

        if (!acc[groupLabel]) acc[groupLabel] = [];
        acc[groupLabel].push({ id: message.id, ...message });

        return acc;
    }, {}) || {};


    return (
        <div className="group-message-bar" style={{ backgroundImage }}>
            <div className="messages-list">

                {Object.entries(groupedMessagesByDate).map(([date, messages]) => (
                    <div key={date} className="date-group">
                        <div className="date-heading">{date}</div>

                        {messages.map((msg) => {
                            // Mesajın göndericisinin userId'sini al
                            const userId = Object.keys(msg.status.sent || {})[0];

                            // GroupChat içindeki groupId'yi al
                            const groupId = GroupChat?.participants?.[0];

                            // GroupList'ten ilgili grubu bul
                            const group = groupList[groupId];

                            // Katılımcılar arasında userId'ye göre kullanıcıyı buluyoruz
                            const senderProfile = group?.participants?.[userId];

                            // isSender kontrolü, mesajın göndericisi ile geçerli kullanıcıyı karşılaştırıyoruz
                            const isSender = currentUserId === userId;

                            // timestamp'i uygun formatta dönüştür
                            const formattedTimestamp = convertToLocalTime(msg.status.sent[userId]);

                            return (
                                <MessageBubble
                                    key={msg.id}
                                    userId={currentUserId}
                                    content={msg.content}
                                    timestamp={formattedTimestamp}
                                    isSender={isSender}
                                    status={msg.status}
                                    isGroupMessageBubble={true}
                                    messageType={msg.type}
                                    senderProfile={senderProfile} // senderProfile burada gönderici profil bilgilerini alır
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GroupMessageBar