import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';

export const newGroupApi = createApi({
  reducerPath: 'newGroupApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5105/api/GroupChat',
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
      query: (formData) => {
        const form = new FormData();

        // "Name" ekleniyor
        form.append('Name', formData.name);

        // "Description" (opsiyonel) ekleniyor
        if (formData.description) {
          form.append('Description', formData.description);
        }

        // "Photo" (opsiyonel) ekleniyor
        if (formData.photo) {
          form.append('Photo', formData.photo);
        }

        if (formData.participants) {
          const formattedParticipants = {};

          Object.entries(formData.participants).forEach(([userId, user]) => {
            formattedParticipants[userId] = Number(user.Role); 
          });

          form.append('Participants', JSON.stringify(formattedParticipants));
          console.log('Formatted Participants:', formattedParticipants);
        }

        return {
          url: '/CreateGroup',
          method: 'POST',
          body: form,
        };
      },
    }),
  }),
});

export const { useCreateGroupMutation } = newGroupApi;
