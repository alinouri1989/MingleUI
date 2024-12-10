import React from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from '../../../shared/components/MessageBubble/MessageBubble.jsx';

function UserMessageBar({ groupedMessages }) {
  const { backgroundImage } = useSelector((state) => state.chatBackgroundColor);

  return (
    <div className="user-message-bar" style={{ backgroundImage }}>
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
                messageType={msg.messageType}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserMessageBar;
