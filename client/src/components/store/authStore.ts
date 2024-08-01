import create from 'zustand';
import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware';
import axiosInstance, { setAccessToken } from '../API/axiosInstance';
import type { UserType, UserSignInType, UserSignUpType, UserFromBackendType, UserStateType } from '../types';

type AuthState = {
  user: UserStateType | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const authState: StateCreator<
  AuthState,
  [['zustand/persist', AuthState]],
  []
> = (set) => ({
  user: { status: 'guest' } as UserStateType,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<UserFromBackendType>('/auth/signin', { email, password } as UserSignInType);
      const { accessToken, user } = response.data;
      setAccessToken(accessToken);
      set({ user: { status: 'logged', ...user }, isLoading: false });
      document.cookie = `refreshToken=${accessToken}; path=/;`;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<UserFromBackendType>('/auth/signup', { name, email, password } as UserSignUpType);
      const { accessToken, user } = response.data;
      setAccessToken(accessToken);
      set({ user: { status: 'logged', ...user }, isLoading: false });
      document.cookie = `refreshToken=${accessToken}; path=/;`;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get('/auth/logout');
      setAccessToken('');
      set({ user: { status: 'guest' } });
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (error: any) {
      set({ error: error.message });
    }
  },
});

const useAuthStore = create<AuthState>(
  persist(authState, {
    name: 'auth-storage',
    getStorage: () => localStorage,
  })
);

export default useAuthStore;
