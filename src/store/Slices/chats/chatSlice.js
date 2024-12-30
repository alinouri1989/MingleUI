import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Individual: [], // Her biri { id, participants, messages } içerecek
    Group: [], // Henüz boş
    isChatsInitialized: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addNewChat: (state, action) => {
            const { chatId, chatData } = action.payload;

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
        // Gelen veriyi redux state'e ekleme
        initializeChats: (state, action) => {
            const { Individual, Group } = action.payload;

            // Individual verisini dönüştür
            state.Individual = Object.keys(Individual).map(chatId => ({
                id: chatId,
                participants: Individual[chatId].participants,
                archivedFor: Individual[chatId].archivedFor,
                createdDate: Individual[chatId].createdDate,
                messages: Object.entries(Individual[chatId].messages || {}).map(([messageId, messageData]) => ({
                    id: messageId,
                    ...messageData,
                })),
            }));

            // Group verisini dönüştür (eğer gerekiyorsa)
            state.Group = Object.keys(Group).map(chatId => ({
                id: chatId,
                participants: Group[chatId].participants,
                archivedFor: Group[chatId].archivedFor,
                createdDate: Group[chatId].createdDate,
                messages: Object.entries(Group[chatId].messages || {}).map(([messageId, messageData]) => ({
                    id: messageId,
                    ...messageData,
                })),
            }));
            state.isChatsInitialized = true;
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
        
                // Güncellenmiş mesajları kontrol etmek için
                console.log("Güncellenmiş mesajlar:", JSON.parse(JSON.stringify(chat.messages)));
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

        // Mesajları al (chatId üzerinden)
        getChatMessages: (state, action) => {
            const { type, chatId } = action.payload; // type: "Individual" veya "Group"
            const chat = type === "Individual"
                ? state.Individual.find(chat => chat.id === chatId)
                : state.Group.find(chat => chat.id === chatId);
            return chat ? chat.messages : [];
        },

        // Belirli bir bireysel sohbeti sil
        removeIndividualChat: (state, action) => {
            state.Individual = state.Individual.filter(chat => chat.id !== action.payload);
        },

        // Belirli bir grup sohbetini sil
        removeGroupChat: (state, action) => {
            state.Group = state.Group.filter(chat => chat.id !== action.payload);
        },

        // Tüm sohbetleri sıfırla
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
    addMessageToIndividual,
    addMessageToGroup,
    removeIndividualChat,
    removeGroupChat,
    resetChats,
    addNewChat,
    getChatMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
