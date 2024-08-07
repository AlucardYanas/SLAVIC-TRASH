import type React from 'react';
import { useToast } from '@chakra-ui/react';
import type { UserSignInType, UserSignUpType } from '../../types/types';
import { useAppDispatch } from './reduxHooks';
import { logoutThunk, signInThunk, signUpThunk } from '../../redux/auth/authActionThunk';

export default function useAuth(): {
  signInHandler: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  signUpHandler: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  logoutHandler: () => void;
  signInHandlerClick: (e: React.FormEvent<HTMLFormElement>) => void;
  signUpHandlerClick: (e: React.FormEvent<HTMLFormElement>) => void;
} {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const signInHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as unknown;
    const data = formData as UserSignInType;
    try {
      await dispatch(signInThunk(data)).unwrap();
    } catch (error) {
      if (error) {
        toast({
          title: 'Ошибка!',
          description: 'Введены неверные данные.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  const signInHandlerClick = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void signInHandler(e);
  };

  const signUpHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as unknown;
    const data = formData as UserSignUpType;
    if (!data.email || !data.password || !data.username) return;
    try {
      await dispatch(signUpThunk(data)).unwrap();
    } catch (error) {
      // Handle sign-up errors here if needed
    }
  };

  const signUpHandlerClick = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void signUpHandler(e);
  };

  const logoutHandler = (): void => {
    void dispatch(logoutThunk());
  };

  return {
    signInHandler,
    signUpHandler,
    signInHandlerClick,
    signUpHandlerClick,
    logoutHandler,
  };
}
