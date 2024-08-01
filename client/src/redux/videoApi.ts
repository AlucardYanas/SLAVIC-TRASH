import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = 'ZwqlNsH3dIfT1k8NmfgKxEp2Pe1YPdtqXPbknEJai1oJnFn0K5mLoV2I';

export const videoApi = createApi({
    reducerPath: 'videoApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.pexels.com/videos/' }),
    endpoints: (builder) => ({
        getPopularVideos: builder.query({
            query: () => ({
                url: 'popular',
                headers: {
                    Authorization: API_KEY,
                },
            }),
        }),
    }),
});

export const { useGetPopularVideosQuery } = videoApi;






















// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { VideoType } from '../types/types';

// export const videosApi = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
//   tagTypes: ['Video'],
//   endpoints: (builder) => ({
//     getVideos: builder.query<VideoType[], void>({
//       query: () => '/videos',
//       providesTags: ['Video'],
//     }),
//   }),
// });

//   getTrackById: builder.query<TrackType, number>({
//     query: (id) => `/tracks/${id}`,
//     providesTags: ['Track'],
//   }),
//   getTracksByGenre: builder.query<TrackType[], number>({
//     query: (genreId) => `/tracks/genre/${genreId}`,
//     providesTags: ['Track'],
//   }),
//   addTrack: builder.mutation<TrackType, TrackCrateType >({
//     query: (track) => ({
//       url: `/tracks/genre/${track.genre_id}`,
//       method: 'POST',
//       body: track,
//     }),
//     invalidatesTags: ['Track'],
//   }),
//   updateTrack: builder.mutation<TrackType, Partial<TrackType>>({
//     query: (track) => ({
//       url: `/tracks/${track.id}`,
//       method: 'PATCH',
//       body: {
//         title: track.title,
//         group: track.group,
//         img: track.img,
//         genre_id: track.genre_id,
//       },
//     }),
//     invalidatesTags: ['Track'],
//   }),
//   deleteTrack: builder.mutation<{ success: boolean }, number>({
//     query: (id) => ({
//       url: `/tracks/${id}`,
//       method: 'DELETE',
//     }),
//     invalidatesTags: ['Track'],
//   }),
// export const {
//   useGetVideosQuery,
//   // useGetTrackByIdQuery,
//   // useGetTracksByGenreQuery,
//   // useAddTrackMutation,
//   // useUpdateTrackMutation,
//   // useDeleteTrackMutation,
// } = videosApi;
