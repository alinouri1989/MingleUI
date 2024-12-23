import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';
import { prepareGroupFormData } from '../../helpers/prepareGroupFormData';

export const GroupApi = createApi({
  reducerPath: 'newGroupApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5069/api/GroupChat',
    prepareHeaders: (headers) => {
      const token = getJwtFromCookie();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (formData) => ({
        url: '/CreateGroup',
        method: 'POST',
        body: prepareGroupFormData(formData, false),
      }),
    }),

    getGroupProfile: builder.query({
      query: (chatId) => ({
        url: `/GetGroupProfile/${chatId}`,
        method: 'GET',
      }),
    }),

    editGroup: builder.mutation({
      query: ({ groupId, formData }) => ({
        url: `/EditGroup/${groupId}`,
        method: 'PUT',
        body: prepareGroupFormData(formData, true),
      }),
    }),

    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/LeaveGroup/${groupId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetGroupProfileQuery,
  useEditGroupMutation,
  useLeaveGroupMutation
} = GroupApi;