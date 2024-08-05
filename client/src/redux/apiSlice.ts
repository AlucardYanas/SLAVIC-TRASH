import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UploadVideoResponse, VideoType } from '../types/types';

// API для загрузки видео и управления видео
export const uploadVideoApi = createApi({
  reducerPath: 'uploadVideoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['UploadVideo', 'Video', 'PendingVideo'], // Добавляем теги для видео и ожидающих видео
  endpoints: (builder) => ({
    uploadVideo: builder.mutation<UploadVideoResponse, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'PendingVideo', id: 'LIST' }], // Инвалидируем кеш списка ожидающих видео
    }),
    getPendingVideos: builder.query<VideoType[], void>({
      query: () => '/admin/pending',
      transformResponse: (response: { message?: string } | VideoType[]) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response.message === 'No new videos for approval') {
          return [];
        }
        throw new Error('Unexpected response format');
      },
      providesTags: [{ type: 'PendingVideo', id: 'LIST' }],
    }),
    approveVideo: builder.mutation<VideoType, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/approve/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'PendingVideo', id: 'LIST' }, { type: 'Video', id: 'LIST' }],
    }),
    disapproveVideo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/disapprove/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'PendingVideo', id: 'LIST' }],
    }),
  }),
});

export const {
  useUploadVideoMutation,
  useGetPendingVideosQuery,
  useApproveVideoMutation,
  useDisapproveVideoMutation,
} = uploadVideoApi;
