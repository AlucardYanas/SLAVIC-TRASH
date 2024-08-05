// redux/upload/uploadSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UploadVideoResponse, VideoType } from '../../types/types';

// API для загрузки видео и управления видео
export const uploadVideoApi = createApi({
  reducerPath: 'uploadVideoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['UploadVideo', 'Video', 'PendingVideo'],
  endpoints: (builder) => ({
    uploadVideo: builder.mutation<UploadVideoResponse, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Video', id: 'LIST' }],
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
    getExtractedTexts: builder.query<{ texts: string[] }, number>({
      query: (videoId) => `/videos/${videoId}/texts`,
      providesTags: (result, error, videoId) => [{ type: 'Video', id: videoId }],
    }),
    getAllVideos: builder.query<VideoType[], void>({
      query: () => '/videos',
      providesTags: [{ type: 'Video', id: 'LIST' }],
    }),
  }),
});

export const {
  useUploadVideoMutation,
  useGetPendingVideosQuery,
  useApproveVideoMutation,
  useDisapproveVideoMutation,
  useGetExtractedTextsQuery,
  useGetAllVideosQuery,
} = uploadVideoApi;
