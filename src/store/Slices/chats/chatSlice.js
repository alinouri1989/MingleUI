import { createSlice } from '@reduxjs/toolkit';
import { decryptMessage } from '../../../helpers/messageCryptoHelper';

const initialState = {
    Individual: [],
    Group: [],
    isChatsInitialized: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        initializeChats: (state, action) => {
            const { Individual, Group } = action.payload;

            state.Individual = transformChats(Individual, "individual");
            state.Group = transformChats(Group, "group");
            state.isChatsInitialized = true;
        },
        addNewIndividualChat: (state, action) => {
            const { chatId, chatData } = action.payload;

            // Eğer chatId zaten mevcutsa, yeni sohbeti eklemeyin
            const chatExists = state.Individual.some(chat => chat.id === chatId);
            if (chatExists) {
                return;
            }

            // Gelen chat objesini uygun formata çevir
            const newChat = {
                id: chatId,
                participants: chatData.participants,
                archivedFor: chatData.archivedFor || {},
                createdDate: chatData.createdDate,
                messages: Object.entries(chatData.messages || {}).map(([messageId, messageData]) => ({
                    id: messageId,
                    ...messageData,
                })),
            };


            state.Individual.push(newChat);

        },
        addNewGroupChat: (state, action) => {
            const { chatId, chatData } = action.payload;

            if (!chatData || !chatData.participants) {
                return;
            }

            const groupExists = state.Group.some(groupChat => groupChat.id === chatId);
            if (groupExists) {
                return;
            }

            const newGroupChat = {
                id: chatId,
                participants: chatData.participants,
                archivedFor: chatData.archivedFor || {},
                createdDate: chatData.createdDate,
                messages: Object.entries(chatData.messages || {}).map(([messageId, messageData]) => ({
                    id: messageId,
                    ...messageData,
                })),
            };
            state.Group.push(newGroupChat);
        },
        addMessageToIndividual: (state, action) => {
            const { chatId, messageId, messageData, userId } = action.payload;

            const chat = state.Individual.find(chat => chat.id === chatId);

            if (chat) {
                const existingMessageIndex = chat.messages.findIndex(msg => msg.id === messageId);

                if (existingMessageIndex > -1) {
                    const existingMessage = chat.messages[existingMessageIndex];

                    const isDeletedForOthers = messageData.deletedFor &&
                        Object.keys(messageData.deletedFor).some(id => id !== userId);

                    if (!(isDeletedForOthers && messageData.content === "")) {
                        chat.messages[existingMessageIndex] = { ...existingMessage, ...messageData };
                    }
                } else {
                    chat.messages.push({ id: messageId, ...messageData });
                }
            } else {
                const newChat = {
                    id: Object.keys(action.payload.Individual)[0],
                    participants: [],
                    archivedFor: {},
                    createdDate: new Date().toISOString(),
                    messages: Object.entries(action.payload.Individual).map(([chatId, messages]) => {
                        return Object.entries(messages).map(([messageId, messageData]) => ({
                            id: messageId,
                            ...messageData
                        }));
                    }).flat()
                };

                state.Individual.push(newChat);
            }
        },
        addMessageToGroup: (state, action) => {
            const { chatId, messageId, messageData, userId } = action.payload;

            const chat = state.Group.find(chat => chat.id === chatId);

            if (chat) {
                const existingMessageIndex = chat.messages.findIndex(msg => msg.id === messageId);

                if (existingMessageIndex > -1) {
                    const existingMessage = chat.messages[existingMessageIndex];

                    const isDeletedForOthers = messageData.deletedFor &&
                        Object.keys(messageData.deletedFor).some(id => id !== userId);

                    if (!(isDeletedForOthers && messageData.content === "")) {
                        chat.messages[existingMessageIndex] = { ...existingMessage, ...messageData };
                    }
                } else {
                    chat.messages.push({ id: messageId, ...messageData });
                }
            } else {
                const newChat = {
                    id: Object.keys(action.payload.Group)[0],
                    participants: [],
                    archivedFor: {},
                    createdDate: new Date().toISOString(),
                    messages: Object.entries(action.payload.Group).map(([chatId, messages]) => {
                        return Object.entries(messages).map(([messageId, messageData]) => ({
                            id: messageId,
                            ...messageData
                        }));
                    }).flat()
                };

                state.Group.push(newChat);
            }
        },
        getChatMessages: (state, action) => {
            const { type, chatId } = action.payload;
            const chat = type === "Individual"
                ? state.Individual.find(chat => chat.id === chatId)
                : state.Group.find(chat => chat.id === chatId);
            return chat ? chat.messages : [];
        },
        addArchive: (state, action) => {
            const { Individual } = action.payload;
            const chatId = Object.keys(Individual)[0];
            const archiveData = Individual[chatId];

            const chatIndex = state.Individual.findIndex(chat => chat.id === chatId);
            if (chatIndex !== -1) {
                state.Individual[chatIndex].archivedFor = {
                    ...state.Individual[chatIndex].archivedFor,
                    ...archiveData
                };
            }
        },
        removeArchive: (state, action) => {

            const individual = action.payload.Individual; // Gelen verideki Individual objesini al
            for (let chatId in individual) {  // Individual içindeki her bir chatId'yi kontrol et
                if (individual.hasOwnProperty(chatId)) {  // Eğer chatId'nin kendisi varsa
                    const chatIndex = state.Individual.findIndex(chat => chat.id === chatId);

                    if (chatIndex !== -1) {
                        // İlgili chatId'yi bulduk, archivedFor alanını boş yap
                        state.Individual[chatIndex].archivedFor = {};
                    }
                }
            }
        },
        removeIndividualChat: (state, action) => {
            const chatId = Object.keys(action.payload.Individual)[0];

            const chatIndex = state.Individual.findIndex(chat => chat.id === chatId);

            if (chatIndex !== -1) {
                state.Individual[chatIndex].messages = [];
            }
        },
        removeGroupChat: (state, action) => {
            state.Group = state.Group.filter(group => !group.participants.includes(action.payload));
        },
        resetChats: (state) => {
            state.Individual = [];
            state.Group = [];
        },
    },
});

export const getChatId = (state, authId, receiveId) => {
    const chat = state.Individual.find(chat =>
        chat.participants.includes(authId) && chat.participants.includes(receiveId)
    );
    return chat ? chat.id : null;
};

const transformChats = (chats, chatType) =>
    Object.keys(chats).map(chatId => ({
        id: chatId,
        participants: chats[chatId].participants,
        archivedFor: chats[chatId].archivedFor,
        createdDate: chats[chatId].createdDate,
        messages: Object.entries(chats[chatId].messages || {}).map(([messageId, messageData]) => {
            let decryptedContent = messageData.content;
            if (messageData.type === 0 && decryptedContent && decryptedContent !== "Bu mesaj silindi.") {
                decryptedContent = decryptMessage(messageData.content, chatId);
            }
            return {
                id: messageId,
                ...messageData,
                content: decryptedContent,
            };
        }),
    }));

export const {
    initializeChats,
    addNewIndividualChat,
    addNewGroupChat,
    addMessageToIndividual,
    addMessageToGroup,
    getChatMessages,
    removeIndividualChat,
    removeGroupChat,
    resetChats,
    addArchive, removeArchive
} = chatSlice.actions;

export default chatSlice.reducer;
