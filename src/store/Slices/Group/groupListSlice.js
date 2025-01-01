import { createSlice } from '@reduxjs/toolkit';

const groupListSlice = createSlice({
  name: 'groupList',
  initialState: {
    groupList: {},
    isGroupListInitialized: false,
  },
  reducers: {
    setGroupList(state, action) {
      state.groupList = {
        ...state.groupList,
        ...action.payload,
      };
      state.isGroupListInitialized = true;
    },
    updateUserInfoToGroupList(state, action) {
      const data = action.payload;

      Object.entries(data).forEach(([userId, updates]) => {
        Object.keys(state.groupList).forEach((groupId) => {
          const group = state.groupList[groupId];
          const participant = group.participants[userId];

          if (participant) {
            group.participants[userId] = {
              ...participant,
              ...updates,
            };
          }
        });
      });
    },
  },
});

export const { setGroupList, updateUserInfoToGroupList } = groupListSlice.actions;
export default groupListSlice.reducer;
