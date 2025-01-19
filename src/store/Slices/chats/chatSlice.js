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

            // Individual verisini dönüştür ve içeriklerini çöz
            state.Individual = Object.keys(Individual).map(chatId => ({
                id: chatId,
                participants: Individual[chatId].participants,
                archivedFor: Individual[chatId].archivedFor,
                createdDate: Individual[chatId].createdDate,
                messages: Object.entries(Individual[chatId].messages || {}).map(([messageId, messageData]) => {
                    let decryptedContent = messageData.content;
                    if (decryptedContent && decryptedContent !== "Bu mesaj silindi.") {
                        decryptedContent = decryptMessage(messageData.content, chatId);
                    }
                    return {
                        id: messageId,
                        ...messageData,
                        content: decryptedContent
                    };
                }),
            }));
        },

        addNewIndividualChat: (state, action) => {
            const { chatId, chatData } = action.payload;

            // Eğer chatId zaten mevcutsa, yeni sohbeti eklemeyin
            const chatExists = state.Individual.some(chat => chat.id === chatId);
            if (chatExists) {
                console.log("Bu sohbet zaten mevcut:", chatId);
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

            // Yeni sohbeti Individual listesine ekle
            state.Individual.push(newChat);

            // Eklenen sohbeti loglamak için
            console.log("Yeni sohbet eklendi:", newChat);
        },

        addNewGroupChat: (state, action) => {
            const { chatId, chatData } = action.payload;

            if (!chatData || !chatData.participants) {
                console.error("Geçersiz chatData yapısı:", chatData);
                return;
            }

            const groupExists = state.Group.some(groupChat => groupChat.id === chatId);
            if (groupExists) {
                console.log("Bu grup sohbeti zaten mevcut:", chatId);
                return;
            }

            const newGroupChat = {
                id: chatId,
                participants: chatData.participants,
                archivedFor: chatData.archivedFor || {},
                createdDate: chatData.createdDate,
                groupName: chatData.groupName || "Unnamed Group",
                admin: chatData.admin || null,
                messages: Object.entries(chatData.messages || {}).map(([messageId, messageData]) => ({
                    id: messageId,
                    ...messageData,
                })),
            };
            state.Group.push(newGroupChat);
        },

        addMessageToIndividual: (state, action) => {
            const { chatId, messageId, messageData } = action.payload;

            const chat = state.Individual.find(chat => chat.id === chatId);

            if (chat) {
                // Var olan sohbetin mesajını güncelle veya ekle
                const existingMessageIndex = chat.messages.findIndex(msg => msg.id === messageId);

                if (existingMessageIndex > -1) {
                    chat.messages[existingMessageIndex] = { ...chat.messages[existingMessageIndex], ...messageData };
                } else {
                    chat.messages.push({ id: messageId, ...messageData });
                }

            } else {
                // Yeni sohbet ekle
                const newChat = {
                    id: Object.keys(action.payload.Individual)[0], // Yeni sohbetin ID'si
                    participants: [], // Katılımcılar için bir yapı belirtebilirsiniz
                    archivedFor: {},  // Varsayılan değerler
                    createdDate: new Date().toISOString(), // Şimdiki tarih
                    messages: Object.entries(action.payload.Individual).map(([chatId, messages]) => {
                        return Object.entries(messages).map(([messageId, messageData]) => ({
                            id: messageId,
                            ...messageData
                        }));
                    }).flat() // Gelen mesajları formatla ve tek bir düz liste haline getir
                };

                state.Individual.push(newChat);

                // Yeni eklenen sohbeti kontrol etmek için
                console.log("Yeni sohbet eklendi:", JSON.parse(JSON.stringify(newChat)));
            }
        },

        addMessageToGroup: (state, action) => {
            const { chatId, messageId, messageData } = action.payload;

            // İlgili chat'i bul veya oluştur
            const chat = state.Group.find((chat) => chat.id === chatId);

            if (chat) {
                // Mesajı varsa güncelle, yoksa ekle
                const existingMessageIndex = chat.messages.findIndex((msg) => msg.id === messageId);

                if (existingMessageIndex > -1) {
                    chat.messages[existingMessageIndex] = { id: messageId, ...messageData };
                } else {
                    chat.messages.push({ id: messageId, ...messageData });
                }
            } else {
                // Eğer chatId yoksa yeni bir chat oluştur
                state.Group.push({
                    id: chatId,
                    participants: [],
                    archivedFor: {},
                    createdDate: new Date().toISOString(),
                    messages: [{ id: messageId, ...messageData }],
                });
            }
        },

        getChatMessages: (state, action) => {
            const { type, chatId } = action.payload;
            const chat = type === "Individual"
                ? state.Individual.find(chat => chat.id === chatId)
                : state.Group.find(chat => chat.id === chatId);
            return chat ? chat.messages : [];
        },

        removeIndividualChat: (state, action) => {
            state.Individual = state.Individual.filter(chat => chat.id !== action.payload);
        },

        removeGroupChat: (state, action) => {
            state.Group = state.Group.filter(chat => chat.id !== action.payload);
        },

        resetChats: (state) => {
            state.Individual = [];
            state.Group = [];
        },
    },
});

export const getChatId = (state, authId, receiveId) => {
    // Individual sohbetlerinde authId ve receiveId'yi içeren bir chatId arıyoruz
    const chat = state.Individual.find(chat =>
        chat.participants.includes(authId) && chat.participants.includes(receiveId)
    );
    return chat ? chat.id : null;  // Eğer chat bulunamazsa null döndür
};

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
} = chatSlice.actions;

export default chatSlice.reducer;
