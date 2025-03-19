import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';

const BASE_URL = import.meta.env.VITE_APP_BASE_API_URL;

export const searchUsersApi = createApi({
    reducerPath: 'searchUsersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}api/`,
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
