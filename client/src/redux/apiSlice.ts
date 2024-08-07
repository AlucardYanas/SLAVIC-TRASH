import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { VideoType } from '../types/types';

export type ApiResponse<T> = {
  data: T;
}

export const videosApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Video'],
  endpoints: (builder) => ({
    getVideos: builder.query<ApiResponse<VideoType[]>, void>({
      query: () => '/videos',
      providesTags: ['Video'],
    }),
  }),
});

export const {
  useGetVideosQuery,
} = videosApi;
