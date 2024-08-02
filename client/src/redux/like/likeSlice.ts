// redux/slices/viewHistorySlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserVideoType, LikeType, VideoType } from '../../types/types';

// API для работы с историей просмотров и лайками
export const viewHistoryApi = createApi({
  reducerPath: 'viewHistoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['ViewHistory', 'LikedVideos'],
  endpoints: (builder) => ({
    getViewHistory: builder.query<UserVideoType[], { userId: number }>({
      query: ({ userId }) => `/viewHistory/${userId}`,
      providesTags: ['ViewHistory'],
    }),
    markVideoAsViewed: builder.mutation<void, UserVideoType>({
      query: ({ userId, videoId }) => ({
        url: `/viewHistory`,
        method: 'POST',
        body: { userId, videoId },
      }),
      invalidatesTags: ['ViewHistory'],
    }),
    getLikedVideos: builder.query<VideoType[], { userId: number }>({
      query: ({ userId }) => `/likedVideos/${userId}`,
      providesTags: ['LikedVideos'],
    }),
    likeVideo: builder.mutation<void, LikeType>({
      query: ({ userId, videoId }) => ({
        url: `/likedVideos`,
        method: 'POST',
        body: { userId, videoId },
      }),
      invalidatesTags: ['LikedVideos'],
    }),
  }),
});

export const {
  useGetViewHistoryQuery,
  useMarkVideoAsViewedMutation,
  useGetLikedVideosQuery,
  useLikeVideoMutation,
} = viewHistoryApi;
