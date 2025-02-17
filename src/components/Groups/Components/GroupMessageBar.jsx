import React, { useRef } from 'react'
import MessageBubble from "../../../shared/components/MessageBubble/MessageBubble.jsx";
import { useSelector } from 'react-redux';
import { getChatBackgroundColor } from '../../../helpers/getChatBackgroundColor.js';
import { useEffect } from 'react';
import { getUserIdFromToken } from '../../../helpers/getUserIdFromToken.js';
import { convertToLocalTime } from '../../../helpers/convertToLocalTime.js';
import { opacityAndTransformEffect, opacityEffect } from '../../../shared/animations/animations.js';
import FirstChatBanner from "../../../assets/images/Home/FirstChatBanner.png";
import { motion } from "framer-motion";
import useScreenWidth from '../../../hooks/useScreenWidth.js';

function GroupMessageBar({ groupId }) {

    const { user, token } = useSelector((state) => state.auth);


    const { Group } = useSelector((state) => state.chat);
    const { groupList } = useSelector((state) => state.groupList);
    const currentUserId = getUserIdFromToken(token);

    const GroupChat = Group.find(group => group?.id === groupId);
    const backgroundImage = getChatBackgroundColor(user.userSettings.chatBackground)

    const messagesContainerRef = useRef(null);
    const isSmallScreen = useScreenWidth(900);
    const colorPalette = ["#4984F1", "#3B3BBA", "#21BE43", "#FFAB3D", "#FF4D4D", "#7E51CD", "#10AA91", "#9F2162", "#94775D"];
    const userColorsRef = useRef(new Map());

    const assignColorToUser = (userId) => {
        if (!userColorsRef.current.has(userId)) {
            const availableColor = colorPalette[userColorsRef.current.size % colorPalette.length];
            userColorsRef.current.set(userId, availableColor);
        }
        return userColorsRef.current.get(userId);
    };


    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
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

    const filteredGroupedMessages = Object.entries(groupedMessagesByDate).filter(
        ([_, messages]) => messages.length > 0
    );

    return (
        <motion.div
            key={groupId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={isSmallScreen ? { delay: 0.4, duration: 0.5 } : { duration: 0 }}
            className="group-message-bar" style={{ backgroundImage }}>
            <div className="messages-list" ref={messagesContainerRef} >
                {filteredGroupedMessages.length === 0 ? (
                    <motion.div
                        variants={opacityEffect(1.5)}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.5 }}
                        className="first-chat-box"
                    >
                        <img src={FirstChatBanner} alt="No messages yet" />
                        <motion.p {...opacityAndTransformEffect(0.5, 30, 0.5)}>
                            İlk mesajınızı göndererek sohbeti başlatın
                        </motion.p>
                    </motion.div>
                ) : (
                    filteredGroupedMessages.map(([date, messages]) => (
                        <div key={date} className="date-group">
                            <div className="date-heading">{date}</div>

                            {messages.map((msg) => {
                                const userId = Object.keys(msg.status.sent || {})[0];
                                const groupListId = GroupChat?.participants?.[0];
                                const group = groupList[groupListId];
                                const senderProfile = group?.participants?.[userId];
                                const isSender = currentUserId === userId;
                                const formattedTimestamp = convertToLocalTime(
                                    msg.status.sent[userId]
                                );
                                const userColor = assignColorToUser(userId);

                                return (
                                    <MessageBubble
                                        key={msg.id}
                                        chatId={groupId}
                                        messageId={msg.id}
                                        userId={currentUserId}
                                        content={msg.content}
                                        timestamp={formattedTimestamp}
                                        isSender={isSender}
                                        status={msg.status}
                                        isGroupMessageBubble={true}
                                        messageType={msg.type}
                                        senderProfile={senderProfile}
                                        userColor={userColor}
                                    />
                                );
                            })}
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}

export default GroupMessageBar