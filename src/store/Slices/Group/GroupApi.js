import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';
import { prepareGroupFormData } from '../../helpers/prepareGroupFormData';

const BASE_URL = import.meta.env.VITE_APP_BASE_API_URL;

export const GroupApi = createApi({
  reducerPath: 'newGroupApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}api/Group`,
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
        url: '/Create',
        method: 'POST',
        body: prepareGroupFormData(formData, false),
      }),
    }),

    editGroup: builder.mutation({
      query: ({ groupId, formData }) => ({
        url: `/Edit/${groupId}`,
        method: 'PUT',
        body: prepareGroupFormData(formData, true),
      }),
    }),

    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/Leave/${groupId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useEditGroupMutation,
  useLeaveGroupMutation
} = GroupApi;