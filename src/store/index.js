import { configureStore } from '@reduxjs/toolkit';
import { authApi } from "./Slices/auth/authApi.js"
import authReducer from "./Slices/auth/authSlice.js";
import { userSettingsApi } from './Slices/userSettings/userSettingsApi.js';
import { searchUsersApi } from './Slices/searchUsers/searchUserApi.js';
import participantsReducer from "./Slices/Group/participants.js";
import { newGroupApi } from './Slices/Group/newGroupApi.js';

const store = configureStore({
  reducer: {
    //RTK Reducers
    auth: authReducer,
    groupParticipants: participantsReducer,

    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [userSettingsApi.reducerPath]: userSettingsApi.reducer,
    [searchUsersApi.reducerPath]: searchUsersApi.reducer,
    [newGroupApi.reducerPath]: newGroupApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat
      (authApi.middleware,
        userSettingsApi.middleware,
        searchUsersApi.middleware,
        newGroupApi.middleware
      ),
});

export default store;
