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
        generateText: builder.mutation({
            query: ({ prompt, aiModel }) => ({
                url: 'GenerativeAi/GenerateText',
                method: 'POST',
                body: {
                    prompt: prompt,
                    aiModel: aiModel
                },
            }),
        }),
        generateImage: builder.mutation({
            query: ({ prompt, aiModel }) => ({
                url: 'GenerativeAi/GenerateImage',
                method: 'POST',
                body: {
                    prompt: prompt,
                    aiModel: aiModel
                },
            }),
        }),
    }),
});

export const {
    useGenerateTextMutation,
    useGenerateImageMutation
} = MingleAiApi;
