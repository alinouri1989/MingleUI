import { configureStore } from '@reduxjs/toolkit';
import { authApi } from "./Slices/auth/authApi.js"
import authReducer from "./Slices/auth/authSlice.js";
import { userSettingsApi } from './Slices/userSettings/userSettingsApi.js';
import { searchUsersApi } from './Slices/searchUsers/searchUserApi.js';
import { GroupApi } from './Slices/Group/GroupApi.js';
import chatReducer from "./Slices/chats/chatSlice.js";
import chatListReducer from "./Slices/chats/chatListSlice.js";
import groupListReducer from "./Slices/Group/groupListSlice.js";


const store = configureStore({
  reducer: {
    //RTK Reducers
    auth: authReducer,
    chat: chatReducer,
    chatList: chatListReducer,
    groupList : groupListReducer,

    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [userSettingsApi.reducerPath]: userSettingsApi.reducer,
    [searchUsersApi.reducerPath]: searchUsersApi.reducer,
    [GroupApi.reducerPath]: GroupApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat
      (authApi.middleware,
        userSettingsApi.middleware,
        searchUsersApi.middleware,
        GroupApi.middleware
      ),
});

export default store;
