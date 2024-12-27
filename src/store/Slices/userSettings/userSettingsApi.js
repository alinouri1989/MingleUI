import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie.js';
import { updateUserField } from "../../helpers/updateUserField.js";
import { setUser } from '../auth/authSlice.js';
import { current } from '@reduxjs/toolkit';

export const userSettingsApi = createApi({
  reducerPath: 'accountSettingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5069/api/',
    prepareHeaders: (headers) => {
      const token = getJwtFromCookie();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Remove Profile Photo
    removeProfilePhoto: builder.mutation({
      query: () => ({
        url: 'User/ProfilePhoto',
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          const currentUser = getState().auth.user;
          updateUserField(dispatch, currentUser, 'profilePhoto', data.profilePhoto);
        } catch (error) {
          console.error('Error removing profile photo:', error);
        }
      },
    }),

    // Update Profile Photo
    updateProfilePhoto: builder.mutation({
      query: (file) => {
        const formDataWithHeaders = new FormData();
        formDataWithHeaders.append('ProfilePhoto', file);
        return {
          url: 'User/ProfilePhoto',
          method: 'PATCH',
          body: formDataWithHeaders,
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          const currentUser = getState().auth.user;
          updateUserField(dispatch, currentUser, 'profilePhoto', data.profilePhoto);
        } catch (error) {
          console.error('Error updating profile photo:', error);
        }
      },
    }),

    // Update Display Name
    updateDisplayName: builder.mutation({
      query: (newDisplayName) => ({
        url: 'User/DisplayName',
        method: 'PATCH',
        body: { displayName: newDisplayName },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          await queryFulfilled;
          const currentUser = getState().auth.user;
          updateUserField(dispatch, currentUser, 'displayName', arg);
        } catch (error) {
          console.error('Error updating display name:', error);
        }
      },
    }),

    // Update Phone Number
    updatePhoneNumber: builder.mutation({
      query: (newPhoneNumber) => ({
        url: 'User/PhoneNumber',
        method: 'PATCH',
        body: { phoneNumber: newPhoneNumber },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          await queryFulfilled;
          const currentUser = getState().auth.user;
          updateUserField(dispatch, currentUser, 'phoneNumber', arg);
        } catch (error) {
          console.error('Error updating phone number:', error);
        }
      },
    }),

    // Update Biography
    updateBiography: builder.mutation({
      query: (newBiography) => ({
        url: 'User/Biography',
        method: 'PATCH',
        body: { biography: newBiography },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          await queryFulfilled;
          const currentUser = getState().auth.user;
          updateUserField(dispatch, currentUser, 'biography', arg);
        } catch (error) {
          console.error('Error updating biography:', error);
        }
      },
    }),

    // Change Password
    changePassword: builder.mutation({
      query: (formData) => ({
        url: 'User/Password',
        method: 'PATCH',
        body: formData,
      }),
    }),

    // ============ Theme Settings  ============

    changeTheme: builder.mutation({
      query: (themeId) => ({
        url: 'User/Theme',
        method: 'PATCH',
        body: { theme: themeId },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          await queryFulfilled;

          const currentUser = getState().auth.user;
          const themeMapping = {
            0: "DefaultSystemMode",
            1: "Light",
            2: "Dark",
          };

          dispatch(
            setUser({
              user: {
                ...currentUser,
                userSettings: {
                  ...currentUser.userSettings,
                  theme: themeMapping[arg],
                },
              },
            })
          );
        } catch (error) {
          console.error('Error updating theme:', error);
        }
      },
    }),

    changeChatBackground: builder.mutation({
      query: (colorId) => ({
        url: 'User/ChatBackground',
        method: 'PATCH',
        body: { chatBackground: colorId },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          await queryFulfilled;

          const currentUser = getState().auth.user;

          dispatch(
            setUser({
              user: {
                ...currentUser,
                userSettings: {
                  ...currentUser.userSettings,
                  chatBackground: arg,
                }
              }
            })
          );
        } catch (error) {
          console.error('Error updating chat background:', error);
        }
      },
    }),

  }),
});

export const {
  useRemoveProfilePhotoMutation,
  useUpdateProfilePhotoMutation,
  useUpdateDisplayNameMutation,
  useUpdatePhoneNumberMutation,
  useUpdateBiographyMutation,
  useChangePasswordMutation,
  useChangeChatBackgroundMutation,
  useChangeThemeMutation
} = userSettingsApi;
