/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/schemas/VideoSchema.ts

import { z } from 'zod';

// Определение схемы видео
export const VideoSchema = z.object({

  id: z.number(), // Убедитесь, что id присутствует здесь
  title: z.string(),
  videoPath: z.string(),
 
  length: z.number(),
 // Массив тегов, который может быть пустым

  thumbnailPath: z.string().optional(), // Превью может отсутствовать
});

export const VideosSchema = z.array(VideoSchema);
