import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';
import { setUser } from './authSlice';
import { removeJwtFromCookie } from '../../helpers/removeJwtFromCookie';

// RTK Query auth API
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7042/api/',
  }),
  endpoints: (builder) => ({
    // Register (SignUp) endpoint
    registerUser: builder.mutation({
      query: (formData) => ({
        url: 'Auth/SignUp',
        method: 'POST',
        body: formData,
      }),
    }),

    // Login (SignIn) endpoint
    loginUser: builder.mutation({
      query: (formData) => ({
        url: 'Auth/SignIn',
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled; // Backend responsunu al
          if (data?.token) {
            // JWT'yi cookie'ye 2 gün ömürlü olacak şekilde kaydet
            const now = new Date();
            const expireDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 gün
            document.cookie = `jwt=${data.token}; expires=${expireDate.toUTCString()}; path=/; secure; samesite=strict`;

            // Kullanıcı bilgilerini çekmek için getUserProfile çağrısı
            const userProfile = await dispatch(authApi.endpoints.getUserProfile.initiate()).unwrap();

            // Kullanıcı bilgilerini ve token'ı Redux store'a kaydet
            dispatch(
              setUser({
                user: userProfile,
                token: data.token,
              })
            );
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),

    resetPassword: builder.mutation({
      query: (email) => ({
        url: 'Auth/Password',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON formatını belirtin
        },
        body: JSON.stringify({ email }), // E-posta verisini JSON formatına çevirin
      }),
    }),
    // Get User Profile endpoint
    getUserProfile: builder.query({
      query: () => {
        const token = getJwtFromCookie();
        return {
          url: 'User/UserInfo',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    // Logout endpoint
    logoutUser: builder.mutation({
      query: () => {
        const token = getJwtFromCookie();
        return {
          url: '/Auth/SignOut',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          removeJwtFromCookie();

          dispatch(setUser({
            user: null,
            token: null,
          }));

        } catch (error) {
          console.error('Logout failed:', error);
        }
      }
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserProfileQuery,
  useLogoutUserMutation,
  useResetPasswordMutation
} = authApi;
