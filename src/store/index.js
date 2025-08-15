import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { authApi } from "./Slices/auth/authApi.js";
import { userSettingsApi } from './Slices/userSettings/userSettingsApi.js';
import { searchUsersApi } from './Slices/searchUsers/searchUserApi.js';
import { GroupApi } from './Slices/Group/GroupApi.js';
import { ChatNestAiApi } from './Slices/ChatNestAi/ChatNestAiApi.js';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userSettingsApi.middleware,
      searchUsersApi.middleware,
      GroupApi.middleware,
      ChatNestAiApi.middleware
    ),
});

export default store;
