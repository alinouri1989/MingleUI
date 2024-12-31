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
        addNewUserToChatList: (state, action) => {
            const newUserId = Object.keys(action.payload)[0];
            const newUserData = action.payload[newUserId];
            if (!state.chatList[newUserId]) {
                state.chatList[newUserId] = {
                    displayName: newUserData.displayName || "Unknown",
                    email: newUserData.email || "",
                    biography: newUserData.biography || "",
                    profilePhoto: newUserData.profilePhoto || "https://res.cloudinary.com/mingle-realtime-messaging-app/image/upload/v1734185072/DefaultUserProfilePhoto.png",
                    connectionSettings: {
                        lastConnectionDate: newUserData.connectionSettings?.lastConnectionDate || null,
                        connectionIds: newUserData.connectionSettings?.connectionIds || []
                    }
                };
            }
        },
        updateUserInfoToChatList: (state, action) => {
            const chatId = Object.keys(action.payload)[0]; // Gelen payload'dan chatId
            const updates = action.payload[chatId]; // Güncellenmesi gereken alanlar

            if (state.chatList[chatId]) {
                Object.entries(updates).forEach(([key, value]) => {
                    if (key === "connectionSettings") {
                        // connectionSettings doğrudan güncellenir
                        state.chatList[chatId].connectionSettings = value;
                    } else {
                        // Diğer alanlar doğrudan güncellenir
                        state.chatList[chatId][key] = value;
                    }
                });
            }
        },
    },
});

export const { setInitialChatList, addNewUserToChatList, updateUserInfoToChatList } = chatListSlice.actions;

export default chatListSlice.reducer;
