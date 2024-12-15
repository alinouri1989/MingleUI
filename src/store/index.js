import { configureStore } from '@reduxjs/toolkit';
import chatBackgroundColorReducer from "./Slices/ChatBackgroundColor.js";
import { authApi } from "./Slices/auth/authApi.js"
import authReducer from "./Slices/auth/authSlice.js";
import { accountSettingsApi } from './Slices/accountSettings/accountSettingsApi.js';

const store = configureStore({
  reducer: {
    //RTK Reducers
    chatBackgroundColor: chatBackgroundColorReducer,
    auth: authReducer,

    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [accountSettingsApi.reducerPath]: accountSettingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat
      (authApi.middleware,
        accountSettingsApi.middleware
      ),
});

export default store;
