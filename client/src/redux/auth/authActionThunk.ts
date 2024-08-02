import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import type { UserFromBackendType, UserSignInType, UserSignUpType } from '../../types/types';
import authService from '../../services/authService';

export const signInThunk = createAsyncThunk<UserFromBackendType, UserSignInType>(
  'auth/signin',
  async (userData) => authService.authSignIn(userData),
);

export const signUpThunk = createAsyncThunk<UserFromBackendType, UserSignUpType>(
  'auth/signup',
  async (userData) => authService.authSignUp(userData),
);

export const logoutThunk = createAsyncThunk<number>(
  'auth/logout',
  async () =>  (await authService.logout()).status,
);

export const checkUserThunk = createAsyncThunk<UserFromBackendType>(
  'auth/check',
  async () =>
    new Promise((resolve, reject) => {
      authService.checkUser().then(resolve).catch(reject);
    }),
);
