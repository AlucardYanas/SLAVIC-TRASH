/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/schemas/VideoSchema.ts

import { z } from 'zod';

// Определение схемы видео
export const VideoSchema = z.object({
  id: z.number(),
  title: z.string(),
  videoPath: z.string(),
  link: z.string().optional(), // Если `link` есть, но может быть пустым
  length: z.number(),
  tags: z.array(z.string()).optional(), // Массив тегов, который может быть пустым
  approved: z.boolean(),
  thumbnailPath: z.string().optional(), // Превью может отсутствовать
});

export const VideosSchema = z.array(VideoSchema);
