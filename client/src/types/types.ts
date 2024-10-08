import type { z } from 'zod';
import type { VideoSchema } from '../utils/validators'; // Импортируем схему

// Тип видео, основанный на схеме
export type VideoType = z.infer<typeof VideoSchema> & {
  id: number;
  videoPath: string;
  link: string;
  length: number;
  tags: string[];
  approved: boolean;
  thumbnailPath?: string;
  extractedTexts?: string[]; // Добавим, если используется в вашем проекте
  transcribedText?: string; // Добавляем новое свойство транскрибированного текста
};

// Интерфейс ответа сервера при загрузке видео
export type UploadVideoResponse = {
  message: string;
  video: VideoType; // Используем тип VideoType для вложенного объекта видео
};

// Тип для лайка
export type LikeType = {
  userId: number;
  videoId: number;
};

// Тип для истории просмотра
export type UserVideoType = {
  userId: number;
  videoId: number;
  watchedAt?: Date;
};

// Определяем тип пользователя
export type UserType = {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
};

// Типы для управления формами регистрации и входа
export type UserSignUpType = Omit<UserType, 'id'> & { password: string };
export type UserSignInType = Omit<UserSignUpType, 'username'>;

// Тип для данных пользователя, возвращаемых с бэкенда
export type UserFromBackendType = { accessToken: string; user: UserType };

// Определяем состояния пользователя
export type UserStateType =
  | { status: 'fetching' }
  | { status: 'guest' }
  | { status: 'loading' }
  | ({ status: 'logged' } & UserType)
  | ({ status: 'admin' } & UserType);

// Тип для данных загрузки видео
export type VideoUploadType = {
  title: string;
  file: File;
  length?: number;
  tags?: string[];
};
