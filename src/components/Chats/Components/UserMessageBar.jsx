import React from 'react'
import MessageBubble from "../../../shared/components/MessageBubble/MessageBubble.jsx";

function UserMessageBar({ groupedMessages }) {
    return (
        <div className="user-message-bar">
            <div className="messages-list">
                {Object.entries(groupedMessages).map(([date, messages]) => (
                    <div key={date} className="date-group">
                        <div className="date-heading">{date}</div>
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                text={msg.text}
                                timestamp={msg.timestamp}
                                isSender={msg.sender === 'user1'}
                                status={msg.status}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="bottom-transparent-linear-gradient"></div>
        </div>
    )
}

export default UserMessageBar