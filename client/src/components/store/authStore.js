import create from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance, { setAccessToken } from '../api/axiosInstance';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post('/auth/signin', { email, password });
          const { accessToken, refreshToken, user } = response.data;
          setAccessToken(accessToken);
          set({ user, isLoading: false });
          // Сохранение refreshToken в cookie или localStorage
          document.cookie = `refreshToken=${refreshToken}; path=/;`;
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post('/auth/signup', { name, email, password });
          const { accessToken, refreshToken, user } = response.data;
          setAccessToken(accessToken);
          set({ user, isLoading: false });
          // Сохранение refreshToken в cookie или localStorage
          document.cookie = `refreshToken=${refreshToken}; path=/;`;
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      logout: async () => {
        try {
          await axiosInstance.get('/auth/logout');
          setAccessToken('');
          set({ user: null });
          // Удаление refreshToken из cookie или localStorage
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } catch (error) {
          set({ error: error.message });
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
