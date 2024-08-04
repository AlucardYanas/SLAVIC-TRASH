import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { VideoType } from '../../types/types';

export const videosApi = createApi({
  reducerPath: 'videosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Video'],
  endpoints: (builder) => ({
    getVideos: builder.query<VideoType[], void>({
      query: () => '/videos',
      providesTags: ['Video'],
    }),
    getLikedVideos: builder.query<VideoType[], { userId: number }>({
      query: ({ userId }) => `/videos/liked/${userId}`,
      providesTags: ['Video'],
    }),
    likeVideo: builder.mutation<void, { userId: number; videoId: number }>({
      query: ({ userId, videoId }) => ({
        url: `/videos/like`,
        method: 'POST',
        body: { userId, videoId },
      }),
      invalidatesTags: ['Video'],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetLikedVideosQuery,
  useLikeVideoMutation,
} = videosApi;
