import { configureStore } from '@reduxjs/toolkit';
import { authApi } from "./Slices/auth/authApi.js"
import authReducer from "./Slices/auth/authSlice.js";
import { userSettingsApi } from './Slices/userSettings/userSettingsApi.js';
import { searchUsersApi } from './Slices/searchUsers/searchUserApi.js';
import groupMembersReducer from "./Slices/newGroup/groupMembers.js";

const store = configureStore({
  reducer: {
    //RTK Reducers
    auth: authReducer,
    groupMembers: groupMembersReducer,

    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [userSettingsApi.reducerPath]: userSettingsApi.reducer,
    [searchUsersApi.reducerPath]: searchUsersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat
      (authApi.middleware,
      userSettingsApi.middleware,
      searchUsersApi.middleware
      ),
});

export default store;
