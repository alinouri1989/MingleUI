import { configureStore } from '@reduxjs/toolkit';
import chatBackgroundColorReducer from "./Slices/ChatBackgroundColor.js";
import { authApi } from "./Slices/authApi.js"

const store = configureStore({
  reducer: {
    //RTK Reducers
    chatBackgroundColor: chatBackgroundColorReducer,

    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware),
});

export default store;
