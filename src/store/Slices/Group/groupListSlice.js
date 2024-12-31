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
        ...action.payload, // Gelen veriyi ekliyoruz
      };
      state.isGroupListInitialized = true;
    },
  },
});

export const { setGroupList } = groupListSlice.actions;
export default groupListSlice.reducer;