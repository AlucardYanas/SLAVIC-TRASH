// redux/slices/uploadVideoSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API для загрузки видео
export const uploadVideoApi = createApi({
  reducerPath: 'uploadVideoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['UploadVideo'],
  endpoints: (builder) => ({
    uploadVideo: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['UploadVideo'],
    }),
  }),
});

export const {
  useUploadVideoMutation,
} = uploadVideoApi;
