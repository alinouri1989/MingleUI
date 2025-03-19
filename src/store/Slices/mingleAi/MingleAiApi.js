import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from '../../helpers/getJwtFromCookie';

const BASE_URL = import.meta.env.VITE_APP_BASE_API_URL;

export const MingleAiApi = createApi({
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
        generateText: builder.mutation({
            query: ({ prompt, aiModel }) => ({
                url: 'GenerativeAi/Text',
                method: 'POST',
                body: {
                    prompt: prompt,
                    aiModel: aiModel
                },
            }),
        }),
        generateImage: builder.mutation({
            query: ({ prompt, aiModel }) => ({
                url: 'GenerativeAi/Image',
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
