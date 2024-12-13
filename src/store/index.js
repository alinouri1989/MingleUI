import { configureStore } from '@reduxjs/toolkit';

import chatBackgroundColorReducer from "./Slices/ChatBackgroundColor.js"


const store = configureStore({
  reducer: {
    chatBackgroundColor: chatBackgroundColorReducer,
  },
});

export default store;
