import { createSlice } from '@reduxjs/toolkit';

const groupMembersSlice = createSlice({
  name: 'groupMembers',
  initialState: {
    groupMembers: [],
  },
  reducers: {
    // Yeni bir kullanıcı eklemek
    addUser: (state, action) => {
      const { userId, role } = action.payload;
      state.groupMembers.push({ userId, role });
    },

    // Bir kullanıcıyı silmek
    removeUser: (state, action) => {
      const userId = action.payload;
      state.groupMembers = state.groupMembers.filter(
        (member) => member.userId !== userId
      );
    },

    // Bir kullanıcının rolünü değiştirmek
    changeRole: (state, action) => {
      const { userId, newRole } = action.payload;
      const user = state.groupMembers.find(
        (member) => member.userId === userId
      );
      if (user) {
        user.role = newRole;
      }
    },
  },
});

export const { addUser, removeUser, changeRole } = groupMembersSlice.actions;

export default groupMembersSlice.reducer;
