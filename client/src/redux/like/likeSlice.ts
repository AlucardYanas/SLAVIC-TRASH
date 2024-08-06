import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LikeType, VideoType } from '../../types/types';

// API для работы с лайками
export const likeApi = createApi({
  reducerPath: 'likeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['LikedVideos'],
  endpoints: (builder) => ({
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
  useGetLikedVideosQuery,
  useLikeVideoMutation,
} = likeApi;
