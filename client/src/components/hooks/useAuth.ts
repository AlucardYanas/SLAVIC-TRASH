import type React from 'react';
import type { UserSignInType, UserSignUpType } from '../../types/types';
import { useAppDispatch } from './reduxHooks';
import { logoutThunk, signInThunk, signUpThunk } from '../../redux/auth/authActionThunk';

export default function useAuth(): {
  signInHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  signUpHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  logoutHandler: () => void;
} {
  const dispatch = useAppDispatch();

  const signInHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as unknown;
    const data = formData as UserSignInType;
    if (!data.email || !data.password) return;
    void dispatch(signInThunk(data));
  };

  const signUpHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as unknown;
    const data = formData as UserSignUpType;
    if (!data.email || !data.password || !data.username) return;
    void dispatch(signUpThunk(data));
  };

  const logoutHandler = (): void => {
    void dispatch(logoutThunk());
  };

  return {
    signInHandler,
    signUpHandler,
    logoutHandler,
  };
}
