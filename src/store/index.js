import { configureStore } from '@reduxjs/toolkit';
import { authApi } from "./Slices/auth/authApi.js"
import authReducer from "./Slices/auth/authSlice.js";
import { userSettingsApi } from './Slices/userSettings/userSettingsApi.js';

const store = configureStore({
  reducer: {
    //RTK Reducers
    auth: authReducer,

    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [userSettingsApi.reducerPath]: userSettingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat
      (authApi.middleware,
        userSettingsApi.middleware
      ),
});

export default store;
