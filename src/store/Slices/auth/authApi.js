import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';
import { setUser } from './authSlice';
import { removeJwtFromCookie } from '../../helpers/removeJwtFromCookie';
import { setUserProfileTheme } from '../../../helpers/applyTheme';

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

    SignInWithEmail: builder.mutation({
      query: (formData) => ({
        url: "Auth/SignInEmail",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        await handleAuthResponse(queryFulfilled, dispatch);
      },
    }),

    SignInGoogle: builder.mutation({
      query: (token) => ({
        url: "Auth/SignInGoogle",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        await handleAuthResponse(queryFulfilled, dispatch);
      },
    }),

    SignInFacebook: builder.mutation({
      query: (token) => ({
        url: "Auth/SignInFacebook",
        method: "POST",
        body: token,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        await handleAuthResponse(queryFulfilled, dispatch);
      },
    }),

    resetPassword: builder.mutation({
      query: (email) => ({
        url: 'Auth/Password',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      }),
    }),

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

const handleAuthResponse = async (queryFulfilled, dispatch) => {
  try {
    const { data } = await queryFulfilled;
    if (data?.token) {
      const now = new Date();
      const expireDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 gün
      document.cookie = `jwt=${data.token}; expires=${expireDate.toUTCString()}; path=/; secure; samesite=strict`;

      const userProfile = await dispatch(authApi.endpoints.getUserProfile.initiate()).unwrap();
      const updatedUserProfile = setUserProfileTheme(userProfile);

      dispatch(setUser({ user: updatedUserProfile, token: data.token }));
    }
  } catch { }
};

export const {
  useRegisterUserMutation,
  useSignInWithEmailMutation,
  useSignInGoogleMutation,
  useSignInFacebookMutation,
  useGetUserProfileQuery,
  useLogoutUserMutation,
  useResetPasswordMutation
} = authApi;
