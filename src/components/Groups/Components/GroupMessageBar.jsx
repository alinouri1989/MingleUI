import React from 'react'
import MessageBubble from "../../../shared/components/MessageBubble/MessageBubble.jsx";
import { useSelector } from 'react-redux';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';
import { useEffect } from 'react';

function GroupMessageBar({ groupdId }) {

    const { user } = useSelector((state) => state.auth);

    const { Group } = useSelector((state) => state.chat);
    const { groupList } = useSelector((state) => state.groupList);

    const GroupChat = Group.find(group => group?.id === groupdId);

    const backgroundImage = getChatBackgroundColor(user.userSettings.chatBackground)

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [GroupChat?.messages]);


    const groupedMessagesByDate = GroupChat?.messages?.reduce((acc, message) => {
        const sentDate = Object.values(message.status.sent)[0];
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
                {Object.entries(groupedMessages).map(([date, messages]) => (
                    <div key={date} className="date-group">
                        <div className="date-heading">{date}</div>
                        {messages.map((msg) => {
                            const userId = Object.keys(msg.status.sent || {})[0];

                            // Grubu belirle (örneğin, msg.groupId ile erişilebilir bir key olabilir)
                            const groupId = msg.groupId;
                            const group = groupList[groupId];

                            // Katılımcılar arasında userId'ye göre kullanıcı bulunuyor
                            const senderProfile = group?.participants?.[userId] || null;

                            return (
                                <MessageBubble
                                    key={msg.id}
                                    content={msg.content}
                                    timestamp={msg.timestamp}
                                    isSender={msg.sender === 'user1'}
                                    status={msg.status}
                                    isGroupMessageBubble={true}
                                    messageType={msg.messageType}
                                    senderProfile={senderProfile} // Kullanıcı profili gönderiliyor
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