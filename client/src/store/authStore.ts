import create from 'zustand';
import type { StateCreator } from 'zustand';
import type {
  UserStateType,
} from '../types/types';

type AuthState = {
  user: UserStateType | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserStateType | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

const authState: StateCreator<AuthState> = (set) => ({
  user: { status: 'guest' } as UserStateType,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
});

const useAuthStore = create<AuthState>(authState);

export default useAuthStore;
