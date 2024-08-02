import { configureStore } from '@reduxjs/toolkit';
import { videosApi } from './apiSlice';
import authSlice from './auth/authSlice';

export const store = configureStore({
  reducer: {
    [videosApi.reducerPath]: videosApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(videosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store;
