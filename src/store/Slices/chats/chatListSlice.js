import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatList: {},
    isChatListInitialized: false,
};

const chatListSlice = createSlice({
    name: "chatList",
    initialState,
    reducers: {
        setInitialChatList: (state, action) => {
            state.chatList = action.payload;
            state.isChatListInitialized = true;
        },
        updateChatUserProperty: (state, action) => {
            const [userId, updates] = Object.entries(action.payload)[0]; // İlk userId ve updates alınır
            if (state.chatList[userId]) {
                // updates içinde lastConnectionDate varsa, bu değeri güncelle
                if (updates.hasOwnProperty('lastConnectionDate')) {
                    state.chatList[userId].connectionSettings.lastConnectionDate = updates.lastConnectionDate;
                }

                // Diğer key'ler varsa, onları da güncelleyebilirsin
                Object.entries(updates).forEach(([key, value]) => {
                    const normalizedKey = key.toLowerCase(); // Gelen key'i küçük harfe çevir
                    const matchedKey = Object.keys(state.chatList[userId]).find(
                        (existingKey) => existingKey.toLowerCase() === normalizedKey
                    );
                    if (matchedKey) {
                        state.chatList[userId][matchedKey] = value; // Eşleşen key'in değerini güncelle
                    }
                });
            } else {
                // Eğer userId chatList'te yoksa, yeni bir kullanıcı ekle
                state.chatList[userId] = {
                    displayName: updates.displayName || "Unknown", // Güncellemelerde varsa displayName al, yoksa "Unknown" kullan
                    email: updates.email || "",
                    biography: updates.biography || "",
                    profilePhoto: updates.profilePhoto || "https://res.cloudinary.com/mingle-realtime-messaging-app/image/upload/v1734185072/DefaultUserProfilePhoto.png",
                    connectionSettings: {
                        lastConnectionDate: updates.lastConnectionDate || null,
                        connectionIds: updates.connectionSettings?.connectionIds || [] // Eğer connectionIds varsa al, yoksa boş dizi
                    }
                };
            }
        },
    },
});

export const { setInitialChatList, updateChatUserProperty } = chatListSlice.actions;

export default chatListSlice.reducer;
