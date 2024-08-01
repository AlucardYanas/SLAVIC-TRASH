import useAuthStore from '../../store/authStore';
import type { UserStateType } from '../../types/types';

type AuthHook = {
  user: UserStateType | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const useAuth = (): AuthHook => {
  const { user, isLoading, error, login, signup, logout } = useAuthStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    signup: state.signup,
    logout: state.logout,
  }));

  return { user, isLoading, error, login, signup, logout };
};

export default useAuth;
