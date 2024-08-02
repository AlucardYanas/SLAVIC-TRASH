import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UploadVideoResponse, VideoType } from '../../types/types';

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
      invalidatesTags: [{ type: 'Video', id: 'LIST' }], // Инвалидируем кеш списка видео
    }),
    getPendingVideos: builder.query<VideoType[], void>({
      query: () => '/admin/pending',
      providesTags: [{ type: 'PendingVideo', id: 'LIST' }],
    }),
    approveVideo: builder.mutation<VideoType, { id: number; tags: string[] }>({
      query: ({ id, tags }) => ({
        url: `/admin/approve/${id}`,
        method: 'POST',
        body: { tags },
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
