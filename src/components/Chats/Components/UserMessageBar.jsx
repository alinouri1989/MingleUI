import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from '../../../shared/components/MessageBubble/MessageBubble.jsx';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';
import { useSignalR } from '../../../contexts/SignalRContext.jsx';
import { getUserIdFromToken } from '../../../helpers/getUserIdFromToken.js';
import { convertToLocalTime } from '../../../helpers/convertToLocalTime.js';
import { SuccessAlert } from '../../../helpers/customAlert.js';

function UserMessageBar({ ChatId }) {
  const { token, user } = useSelector((state) => state.auth);
  const userId = getUserIdFromToken(token);

  const { Individual } = useSelector((state) => state.chat);

  console.log("gelen individual 1:",Individual);

  const { messageConnection } = useSignalR();

  const [messages, setMessages] = useState([]); 

  const backgroundImage = getChatBackgroundColor(user.userSettings.chatBackground);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
  }, [ChatId]);

  useEffect(() => {
    if (messageConnection) {
      const handleReceiveMessages = (newMessage) => {
        setMessages((prevMessages) => {
          console.log(newMessage);
          // Gelen mesajın chatId'sini ayıkla
          const [incomingChatId, chatMessages] = Object.entries(newMessage)[0];

          // Eğer chatId eşleşiyorsa, mesajları ekle
          if (incomingChatId === ChatId) {
            const newMessageArray = Object.entries(chatMessages).map(([messageId, message]) => ({
              id: messageId,
              ...message,
            }));
            return [...prevMessages, ...newMessageArray];
          }

          // Eşleşmiyorsa eski state'i döndür
          return prevMessages;
        });
      };

      messageConnection.on("ReceiveGetMessages", handleReceiveMessages);

      // Cleanup: bağlantıyı ve dinleyiciyi temizle
      return () => {
        messageConnection.off("ReceiveGetMessages", handleReceiveMessages);
      };
    }
  }, [messageConnection, ChatId]);

  console.log(messages)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mesajları tarih bazlı gruplandırma

  const groupedMessagesByDate = messages.reduce((acc, message) => {
    // Mesajın gönderim tarihini ayıkla
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
    acc[groupLabel].push({ id: message.id, ...message });

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
