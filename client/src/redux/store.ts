import { configureStore } from '@reduxjs/toolkit';
import { videosApi } from './apiSlice';
import authSlice from './auth/authSlice';
import { likeApi } from './like/likeSlice'; // Импорт нового слайса
import { uploadVideoApi } from './upload/uploadSlice';

export const store = configureStore({
  reducer: {
    [videosApi.reducerPath]: videosApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer, // Используем новый слайс
    [uploadVideoApi.reducerPath]: uploadVideoApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      videosApi.middleware,
      likeApi.middleware, // Используем middleware нового слайса
      uploadVideoApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store;
