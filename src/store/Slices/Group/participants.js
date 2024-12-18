import { createSlice } from '@reduxjs/toolkit';

const participants = createSlice({
  name: 'participants',
  initialState: {
    participants: [],
  },
  reducers: {
    // Yeni bir kullanıcı eklemek
    addUser: (state, action) => {
      const { userId, profilePhoto, displayName, role } = action.payload;
      state.participants.push({ userId, profilePhoto, displayName, role });
    },

    // Bir kullanıcıyı silmek
    removeUser: (state, action) => {
      const userId = action.payload;
      state.participants = state.participants.filter(
        (member) => member.userId !== userId
      );
    },

    // Bir kullanıcının rolünü değiştirmek
    changeRole: (state, action) => {
      const { userId, newRole } = action.payload;
      const user = state.participants.find((member) => member.userId === userId);
      if (user) {
        user.role = parseInt(newRole, 10); // String'i sayıya çeviriyoruz
      }
    },
  },
});

export const { addUser, removeUser, changeRole } = participants.actions;

export default participants.reducer;
