import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from '../../../shared/components/MessageBubble/MessageBubble.jsx';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';
import { useSignalR } from '../../../contexts/SignalRContext.jsx';
import { getUserIdFromToken } from '../../../helpers/getUserIdFromToken.js';
import { convertToLocalTime } from '../../../helpers/convertToLocalTime.js';

function UserMessageBar() {
  const { token, user } = useSelector((state) => state.auth);
  const userId = getUserIdFromToken(token);

  const { chatConnection } = useSignalR(); // SignalR bağlantısını al

  const [messages, setMessages] = useState([]); // Mesajları tutmak için state
  const backgroundImage = getChatBackgroundColor(user.settings.chatBackground);

  useEffect(() => {
    // SignalR dinleyicisi
    if (chatConnection) {
      chatConnection.on("ReceiveGetMessages", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (chatConnection) {
        chatConnection.off("ReceiveGetMessages");
      }
    };
  }, [chatConnection]);

  // Mesajları tarih bazlı gruplandırma
  const groupedMessagesByDate = messages.reduce((acc, messageObj) => {
    // Mesaj ID'yi ve içeriği ayıkla
    const [messageId, message] = Object.entries(messageObj)[0];

    // Tarihi ayır
    const sentDate = message.status.sent[userId];
    const date = sentDate ? new Date(sentDate).toLocaleDateString() : "Invalid Date"; // Tarih ayarlama

    // Geçerli bir tarih varsa işlemi yap
    if (!acc[date]) acc[date] = [];
    acc[date].push({ id: messageId, ...message });

    return acc;
  }, {});


  return (
    <div className="user-message-bar " style={{ backgroundImage }}>
      <div className="messages-list">
        {Object.entries(groupedMessagesByDate).map(([date, messages]) => (
          <div key={date} className="date-group">
            <div className="date-heading">{date}</div>
            {messages.map((msg) => {
              // Gönderen kullanıcıyı bul
              const senderId = Object.keys(msg.status.sent)[0];
              const isSender = senderId === userId;

              // Mesajın gönderim zamanını dönüştür
              const formattedTimestamp = convertToLocalTime(msg.status.sent[senderId]);

              return (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  timestamp={formattedTimestamp} // Dönüştürülmüş zaman
                  isSender={isSender}
                  status={msg.status}
                  messageType={msg.type}
                  userId={userId}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>

  );
}

export default UserMessageBar;
