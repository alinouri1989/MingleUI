import React from 'react'
import MessageBubble from "../../../shared/components/MessageBubble/MessageBubble.jsx";
import { useSelector } from 'react-redux';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';

function GroupMessageBar({ groupedMessages }) {

     const { user } = useSelector((state) => state.auth);
    
      const backgroundImage = getChatBackgroundColor(user.settings.chatBackground)

    return (
        <div className="group-message-bar" style={{ backgroundImage }}>
            <div className="messages-list">
                {Object.entries(groupedMessages).map(([date, messages]) => (
                    <div key={date} className="date-group">
                        <div className="date-heading">{date}</div>
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                content={msg.content}
                                timestamp={msg.timestamp}
                                isSender={msg.sender === 'user1'}
                                status={msg.status}
                                profileImage={msg.profileImage}
                                userName={msg.userName}
                                isGroupMessageBubble={true}
                                messageType={msg.messageType}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="bottom-transparent-linear-gradient"></div>
        </div>
    )
}

export default GroupMessageBar