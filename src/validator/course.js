import { z } from 'zod';

export const getCoursesSchema = z.object({
  page: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional()
});

export const courseIdSchema = z.object({
  id: z.string().uuid('Invalid ID format')
});

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1').optional()
});

export const updateCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1').optional()
});