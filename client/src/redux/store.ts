import { configureStore } from '@reduxjs/toolkit';
import { videosApi } from './apiSlice';
import authSlice from './auth/authSlice';
import { viewHistoryApi } from './like/likeSlice';
import { uploadVideoApi } from './upload/uploadSlice';

export const store = configureStore({
  reducer: {
    [videosApi.reducerPath]: videosApi.reducer,
    [viewHistoryApi.reducerPath]: viewHistoryApi.reducer,
    [uploadVideoApi.reducerPath]: uploadVideoApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      videosApi.middleware,
      viewHistoryApi.middleware,
      uploadVideoApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store;
