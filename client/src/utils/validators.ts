/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from 'zod';

export const VideoSchema = z.object({
  title: z.string(),
  link: z.string(),
  length: z.number(),
  tags: z.array(z.string()),
});

export const VideosSchema = z.array(VideoSchema);
