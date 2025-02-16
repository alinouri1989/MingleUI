import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from '../../../shared/components/MessageBubble/MessageBubble.jsx';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';
import { useSignalR } from '../../../contexts/SignalRContext.jsx';
import { getUserIdFromToken } from '../../../helpers/getUserIdFromToken.js';
import { convertToLocalTime } from '../../../helpers/convertToLocalTime.js';
import { SuccessAlert } from '../../../helpers/customAlert.js';
import FirstChatBanner from "../../../assets/images/Home/FirstChatBanner.png";
import { motion } from "framer-motion"
import { opacityAndTransformEffect, opacityEffect } from '../../../shared/animations/animations.js';

function UserMessageBar({ ChatId }) {
  const { token, user } = useSelector((state) => state.auth);
  const userId = getUserIdFromToken(token);

  const { Individual } = useSelector((state) => state.chat);


  // ChatId ile eşleşen chat'i bul
  const chat = Individual.find(chat => chat?.id === ChatId);

  const backgroundImage = getChatBackgroundColor(user.userSettings.chatBackground);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages]);
  // Mesajları tarih bazlı gruplandırma

  const groupedMessagesByDate = chat?.messages?.reduce((acc, message) => {
    const sentDate = Object.values(message.status.sent)[0];
    const date = sentDate ? sentDate.split("T")[0] : "Geçersiz Tarih";

    const formattedDate = date !== "Geçersiz Tarih"
      ? date.split("-").reverse().join(".")
      : date;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let groupLabel;
    if (date === today) {
      groupLabel = "Bugün";
    } else if (date === yesterday) {
      groupLabel = "Dün";
    } else {
      groupLabel = formattedDate;
    }

    if (!acc[groupLabel]) acc[groupLabel] = [];
    acc[groupLabel].push({ id: message.id, ...message });

    return acc;
  }, {}) || {};

  // Boş grupları filtrele
  const filteredGroupedMessages = Object.entries(groupedMessagesByDate).filter(
    ([_, messages]) => messages.length > 0
  );

  return (
    <div className="user-message-bar" style={{ backgroundImage }}>
      <div className="messages-list">
        {filteredGroupedMessages.length === 0 ? (
          <motion.div
            variants={opacityEffect(1.5)}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
            className='first-chat-box'>
            <img src={FirstChatBanner} alt="No messages yet" />
            <motion.p
              {...opacityAndTransformEffect(0.5, 30, 0.5)}
            >
              İlk mesajınızı göndererek sohbeti başlatın
            </motion.p>
          </motion.div>
        ) : (
          filteredGroupedMessages.map(([date, messages]) => (
            <div key={date} className="date-group">
              <div className="date-heading">{date}</div>
              {messages.map((msg) => {
                const senderId = Object.keys(msg.status.sent)[0];
                const isSender = senderId === userId;
                const isDeleted = msg.deletedFor?.hasOwnProperty(userId) ?? false;
                const formattedTimestamp = convertToLocalTime(msg.status.sent[senderId]);

                return (
                  <MessageBubble
                    chatId={ChatId}
                    key={msg.id}
                    messageId={msg.id}
                    content={msg.content}
                    timestamp={formattedTimestamp}
                    isSender={isSender}
                    status={msg.status}
                    messageType={msg.type}
                    userId={userId}
                    isDeleted={isDeleted}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default UserMessageBar;
