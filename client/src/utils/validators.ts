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
  link: z.string(), // Если `link` есть, но может быть пустым
  length: z.number(),
  tags: z.array(z.string()).optional(), // Массив тегов, который может быть пустым
  approved: z.boolean(),
  thumbnailPath: z.string().optional(), // Превью может отсутствовать
  extractedTexts: z.array(z.string()).optional(), // Массив для извлеченных текстов
  transcribedText: z.string().optional(), // Поле для транскрибированного текста
});

export const VideosSchema = z.array(VideoSchema);
