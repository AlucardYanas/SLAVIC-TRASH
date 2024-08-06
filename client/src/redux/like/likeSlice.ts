import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LikeType, VideoType } from '../../types/types';

export const likeApi = createApi({
  reducerPath: 'likeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['LikedVideos'],
  endpoints: (builder) => ({
    getLikedVideos: builder.query<VideoType[], { userId: number }>({
      query: ({ userId }) => `/likedVideos/${userId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'LikedVideos' as const, id })), 'LikedVideos']
          : ['LikedVideos'],
    }),
    likeVideo: builder.mutation<void, LikeType>({
      query: ({ userId, videoId }) => ({
        url: `/likedVideos`,
        method: 'POST',
        body: { userId, videoId },
      }),
      invalidatesTags: [{ type: 'LikedVideos', id: 'LIST' }],
    }),
    unlikeVideo: builder.mutation<void, LikeType>({
      // Добавляем мутацию для удаления лайка
      query: ({ userId, videoId }) => ({
        url: `/likedVideos`,
        method: 'DELETE',
        body: { userId, videoId },
      }),
      invalidatesTags: ['LikedVideos'],
    }),
  }),
});

export const { useGetLikedVideosQuery, useLikeVideoMutation, useUnlikeVideoMutation } = likeApi;
