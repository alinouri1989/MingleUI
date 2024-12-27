import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Individual: [], // Her biri { id, participants, messages } içerecek
    Group: [], // Henüz boş
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // Gelen veriyi redux state'e ekleme
        initializeChats: (state, action) => {
            console.log("naber");
            const { Individual, Group } = action.payload;

            // Individual'ı uygun formatta işleyerek sakla
            state.Individual = Object.keys(Individual).map(chatId => ({
                id: chatId,
                participants: Individual[chatId].participants,
                archivedFor: Individual[chatId].archivedFor,
                createdDate: Individual[chatId].createdDate,
                messages: Object.entries(Individual[chatId].messages).map(([messageId, messageData]) => ({
                    id: messageId,
                    ...messageData,
                })),
            }));

            // Group'u doğrudan sakla (henüz boş)
            state.Group = Group || [];
        },

        // Bireysel chat ekle
        addIndividualChat: (state, action) => {
            state.Individual.push(action.payload);
        },

        // Grup chat ekle
        addGroupChat: (state, action) => {
            state.Group.push(action.payload);
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

export const {
    initializeChats,
    addIndividualChat,
    addGroupChat,
    removeIndividualChat,
    removeGroupChat,
    resetChats,
    getChatMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
