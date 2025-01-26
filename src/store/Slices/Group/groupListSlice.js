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
    updateGroupInformations(state, action) {
      const newData = action.payload;
      console.log("NEW DATA", newData);

      Object.keys(newData).forEach((groupId) => {
        const newGroupData = newData[groupId];
        const oldGroupData = state.groupList[groupId];

        if (oldGroupData) {
          // Eski ve yeni `participants` karşılaştır
          const oldParticipants = oldGroupData.participants || {};
          const newParticipants = newGroupData.participants || {};

          // Yeni `participants` içinde olup eski veride `isGroupMember: false` olanları kontrol et
          Object.keys(newParticipants).forEach((userId) => {
            if (oldParticipants[userId] && oldParticipants[userId].isGroupMember === false) {
              // Kullanıcı tekrar grup üyesi olduysa, `isGroupMember: true` yap
              newParticipants[userId] = {
                ...oldParticipants[userId],
                ...newParticipants[userId],
                isGroupMember: true,
              };
            }
          });

          // Eski `participants` içinde olup, yeni gelen `participants` içinde olmayan kullanıcıları bul
          Object.keys(oldParticipants).forEach((userId) => {
            if (!newParticipants[userId]) {
              // Kullanıcı çıkarılmış, bilgisine `isGroupMember: false` ekle
              newParticipants[userId] = {
                ...oldParticipants[userId],
                isGroupMember: false,
              };
            }
          });

          // Güncellenmiş grubu birleştir
          state.groupList[groupId] = {
            ...oldGroupData,
            ...newGroupData,
            participants: newParticipants, // Yeni ve güncellenmiş `participants`
          };
        } else {
          // Grup mevcut değilse yeni grubu ekle
          state.groupList[groupId] = newGroupData;
        }
      });
    }
  },
});

export const { setGroupList, updateUserInfoToGroupList, updateGroupInformations } =
  groupListSlice.actions;
export default groupListSlice.reducer;
