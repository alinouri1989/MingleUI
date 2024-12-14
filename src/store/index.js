import { configureStore } from '@reduxjs/toolkit';
import chatBackgroundColorReducer from "./Slices/ChatBackgroundColor.js";
import { authApi } from "./Slices/auth/authApi.js"
import authReducer from "./Slices/auth/authSlice.js";

const store = configureStore({
  reducer: {
    //RTK Reducers
    chatBackgroundColor: chatBackgroundColorReducer,
    auth: authReducer,

    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware),
});

export default store;
