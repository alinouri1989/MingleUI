import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getJwtFromCookie } from './getJwtFromCookie';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5105/api/',
  prepareHeaders: (headers) => {
    const token = getJwtFromCookie();

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export default baseQuery;
