import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';

export const searchUsersApi = createApi({
    reducerPath: 'searchUsersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:7042/api/User',
        prepareHeaders: (headers) => {
            const token = getJwtFromCookie();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        searchUsers: builder.query({
            query: (query) => ({
                url: "Users",
                method: "GET",
                params: { Query: query },
            }),
        }),
    }),
});
export const { useSearchUsersQuery } = searchUsersApi;
