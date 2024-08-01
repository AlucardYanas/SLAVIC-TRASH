import axiosInstance, { setAccessToken } from '../API/axiosInstance';
import useAuthStore from '../../store/authStore';
import type {
  UserSignInType,
  UserSignUpType,
  UserFromBackendType,
} from '../../types/types';

const useAuth = () => {
  const { user, isLoading, error, setUser, setLoading, setError } = useAuthStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
  }));

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<UserFromBackendType>('/auth/signin', {
        email,
        password,
      } as UserSignInType);
      const { accessToken, user } = response.data;
      setAccessToken(accessToken);
      setUser({ status: 'logged', ...user });
      document.cookie = `refreshToken=${accessToken}; path=/;`;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<UserFromBackendType>('/auth/signup', {
        name,
        email,
        password,
      } as UserSignUpType);
      const { accessToken, user } = response.data;
      setAccessToken(accessToken);
      setUser({ status: 'logged', ...user });
      document.cookie = `refreshToken=${accessToken}; path=/;`;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.get('/auth/logout');
      setAccessToken('');
      setUser({ status: 'guest' });
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, isLoading, error, login, signup, logout };
};

export default useAuth;
