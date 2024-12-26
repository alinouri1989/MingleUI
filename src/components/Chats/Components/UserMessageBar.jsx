import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from '../../../shared/components/MessageBubble/MessageBubble.jsx';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';
import { useSignalR } from '../../../contexts/SignalRContext.jsx';
import { getUserIdFromToken } from '../../../helpers/getUserIdFromToken.js';
import { convertToLocalTime } from '../../../helpers/convertToLocalTime.js';
import { SuccessAlert } from '../../../helpers/customAlert.js';

function UserMessageBar() {
  const { token, user } = useSelector((state) => state.auth);
  const userId = getUserIdFromToken(token);
 

  const { messageConnection } = useSignalR(); // SignalR bağlantısını al

  const [messages, setMessages] = useState([]); // Mesajları tutmak için state
  const backgroundImage = getChatBackgroundColor(user.settings.chatBackground);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messageConnection) {
      messageConnection.on("ReceiveGetMessages", (newMessage) => {
        setMessages((prevMessages) => {
          const newMessageArray = Array.isArray(newMessage) ? newMessage : [newMessage];
          return [...prevMessages, ...newMessageArray];
        });
      });
    }


    return () => {
      if (messageConnection) {
        messageConnection.off("ReceiveGetMessages");
      }
    };
  }, [messageConnection]);
 


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mesajları tarih bazlı gruplandırma

  const groupedMessagesByDate = messages.reduce((acc, messageObj) => {
    // Mesaj ID'yi ve içeriği ayıkla
    const [messageId, message] = Object.entries(messageObj)[0];

    // Tarihi ayıkla: "2024-12-26T07:58:45.275969Z" -> "2024-12-26"
    const sentDate = Object.values(message.status.sent)[0]; // Gönderenin tarih bilgisi
    const date = sentDate ? sentDate.split("T")[0] : "Geçersiz Tarih"; // "2024-12-26"

    // Bugün ve dün tarihlerini hesapla
    const today = new Date().toISOString().split("T")[0]; // "2024-12-26"
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]; // "2024-12-25"

    // Grup başlığı: Bugün, Dün veya tarih
    let groupLabel;
    if (date === today) {
      groupLabel = "Bugün";
    } else if (date === yesterday) {
      groupLabel = "Dün";
    } else {
      groupLabel = date; // Diğer durumlarda tarih
    }

    // Geçerli bir grup başlığı varsa gruba ekle
    if (!acc[groupLabel]) acc[groupLabel] = [];
    acc[groupLabel].push({ id: messageId, ...message });

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
        <div ref={messagesEndRef} />
      </div>
    </div>

  );
}

export default UserMessageBar;
