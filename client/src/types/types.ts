import type { z } from 'zod';
import type { VideoSchema } from '../utils/validators';

export type VideoType = z.infer<typeof VideoSchema>;

export type LikeType = {
  userId: number;
  videoId: number;
};
export type UserVideoType = {
  userId: number;
  videoId: number;
};

export type UserType = {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
};

export type UserSignUpType = Omit<UserType, 'id'> & { password: string };
export type UserSignInType = Omit<UserSignUpType, 'username'>;
export type UserFromBackendType = { accessToken: string; user: UserType };

export type UserStateType =
  | { status: 'fetching' }
  | { status: 'guest' }
  | { status: 'admin' }
  | ({ status: 'logged' } & UserType);
