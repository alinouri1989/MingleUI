import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';

// Kullanıcı Arama API'si
export const searchUsersApi = createApi({
    reducerPath: 'searchUsersApi', // API'nin Reducer Path'i
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5069/api/User', // Backend'in base URL'si
        prepareHeaders: (headers) => {
            const token = getJwtFromCookie(); // JWT Token'ı Cookie'den al
            if (token) {
                headers.set('Authorization', `Bearer ${token}`); // Authorization header ekle
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Kullanıcıları Arama Endpointi
        searchUsers: builder.query({
            query: (query) => ({
                url: "Users",
                method: "GET",
                params: { Query: query },
            }),
        }),
    }),
});

// Hook'ları export et
export const { useSearchUsersQuery } = searchUsersApi;
