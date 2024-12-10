import React from 'react'
import MessageBubble from "../../../shared/components/MessageBubble/MessageBubble.jsx";
import { useSelector } from 'react-redux';

function GroupMessageBar({ groupedMessages }) {

    const { backgroundImage } = useSelector((state) => state.chatBackgroundColor);
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