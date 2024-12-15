import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';

export const accountSettingsApi = createApi({
    reducerPath: 'accountSettingsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5105/api/',
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
                url: 'User/RemoveProfilePhoto',
                method: 'POST',
            }),
        }),

        // Update Profile Photo
        updateProfilePhoto: builder.mutation({
            query: (formData) => {
                const formDataWithHeaders = new FormData();
                formDataWithHeaders.append('ProfilePhoto', formData.file); // Backend'deki 'ProfilePhoto' alanıyla uyumlu
                return {
                    url: 'User/UpdateProfilePhoto',
                    method: 'POST',
                    body: formDataWithHeaders,
                };
            },
        }),

        // Update Display Name
        updateDisplayName: builder.mutation({
            query: (newDisplayName) => ({
                url: 'User/UpdateDisplayName',
                method: 'POST',
                body: { displayName: newDisplayName },
            }),
        }),

        // Update Phone Number
        updatePhoneNumber: builder.mutation({
            query: (newPhoneNumber) => ({
                url: 'User/UpdatePhoneNumber',
                method: 'POST',
                body: { phoneNumber: newPhoneNumber },
            }),
        }),


        // Update Biography
        updateBiography: builder.mutation({
            query: (newBiography) => ({
                url: 'User/UpdateBiography',
                method: 'POST',
                body: { biography: newBiography },
            }),
        }),


        // Change Password
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: 'User/ChangePassword',
                method: 'POST',
                body: passwordData,
            }),
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
} = accountSettingsApi;
