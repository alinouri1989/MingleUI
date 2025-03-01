import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';

export const MingleAiApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:7042/api/',
        prepareHeaders: (headers) => {
            const token = getJwtFromCookie();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        geminiText: builder.mutation({
            query: (prompt) => ({
                url: 'GenerativeAi/GeminiText',
                method: 'POST',
                body: { prompt: prompt },
            }),
        }),
        fluxImage: builder.mutation({
            query: (prompt) => ({
                url: 'GenerativeAi/FluxImage',
                method: 'POST',
                body: { prompt: prompt },
            }),
        }),
    }),
});

export const {
    useGeminiTextMutation,
    useFluxImageMutation
} = MingleAiApi;
