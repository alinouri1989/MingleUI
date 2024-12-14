import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// RTK Query auth API
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5105/api/Authentication',
  }),
  endpoints: (builder) => ({
    // Register (SignUp) endpoint
    registerUser: builder.mutation({
      query: (formData) => ({
        url: '/SignUp',
        method: 'POST',
        body: formData,
      }),
    }),

    // Login (SignIn) endpoint
    loginUser: builder.mutation({
      query: (formData) => ({
        url: '/SignIn',
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // Backend responsunu al
          if (data?.token) {
            // JWT'yi cookie'ye 2 gün ömürlü olacak şekilde kaydet
            const now = new Date();
            const expireDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 gün
            document.cookie = `jwt=${data.token}; expires=${expireDate.toUTCString()}; path=/; secure; samesite=strict`;
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;
