import { combineReducers } from '@reduxjs/toolkit';
import authReducer from "./Slices/auth/authSlice.js";
import chatReducer from "./Slices/chats/chatSlice.js";
import chatListReducer from "./Slices/chats/chatListSlice.js";
import groupListReducer from "./Slices/Group/groupListSlice.js";
import callReducer from "./Slices/calls/callSlice.js";
import { authApi } from "./Slices/auth/authApi.js";
import { userSettingsApi } from './Slices/userSettings/userSettingsApi.js';
import { searchUsersApi } from './Slices/searchUsers/searchUserApi.js';
import { GroupApi } from './Slices/Group/GroupApi.js';

// Tüm reducer'ları birleştir
const appReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    chatList: chatListReducer,
    groupList: groupListReducer,
    call: callReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userSettingsApi.reducerPath]: userSettingsApi.reducer,
    [searchUsersApi.reducerPath]: searchUsersApi.reducer,
    [GroupApi.reducerPath]: GroupApi.reducer,
});

// Root reducer, RESET_STORE action'ını dinler
const rootReducer = (state, action) => {
    if (action.type === 'RESET_STORE') {
        state = undefined; // Bütün state'leri sıfırla
    }
    return appReducer(state, action);
};

export default rootReducer;
