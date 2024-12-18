import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const newGroupApi = createApi({
  reducerPath: 'newGroupApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5105/api/GroupChat',
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

        // "Participants" ekleniyor (JSON string olarak)
        if (formData.participants) {
          form.append(
            'Participants',
            JSON.stringify(formData.participants)
          );
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
