// redux/slices/uploadVideoSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UploadVideoResponse } from '../../types/types';

// API для загрузки видео
export const uploadVideoApi = createApi({
  reducerPath: 'uploadVideoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['UploadVideo', 'Video'], // Добавляем тег для видео
  endpoints: (builder) => ({
    uploadVideo: builder.mutation<UploadVideoResponse, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Video', id: 'LIST' }], // Инвалидируем кеш списка видео
    }),
  }),
});

export const { useUploadVideoMutation } = uploadVideoApi;
