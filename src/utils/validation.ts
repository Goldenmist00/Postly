import { z } from 'zod';
import { POST_CONFIG, CATEGORY_CONFIG, VALIDATION_MESSAGES } from '@/src/constants';

// Post validation schemas
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .max(POST_CONFIG.maxTitleLength, VALIDATION_MESSAGES.maxLength(POST_CONFIG.maxTitleLength))
    .trim(),
  content: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .max(POST_CONFIG.maxContentLength, VALIDATION_MESSAGES.maxLength(POST_CONFIG.maxContentLength))
    .trim(),
  author: z
    .string()
    .max(POST_CONFIG.maxAuthorLength, VALIDATION_MESSAGES.maxLength(POST_CONFIG.maxAuthorLength))
    .trim()
    .optional(),
  image: z
    .string()
    .url(VALIDATION_MESSAGES.url)
    .optional()
    .or(z.literal('')),
  published: z.boolean().optional().default(false),
  categoryIds: z.array(z.number().positive()).optional(),
});

export const updatePostSchema = createPostSchema.extend({
  id: z.number().positive(),
});

export const getPostBySlugSchema = z.object({
  slug: z.string().min(1, VALIDATION_MESSAGES.required),
});

export const getPostByIdSchema = z.object({
  id: z.number().positive(),
});

export const deletePostSchema = z.object({
  id: z.number().positive(),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .max(CATEGORY_CONFIG.maxNameLength, VALIDATION_MESSAGES.maxLength(CATEGORY_CONFIG.maxNameLength))
    .trim(),
  description: z
    .string()
    .max(CATEGORY_CONFIG.maxDescriptionLength, VALIDATION_MESSAGES.maxLength(CATEGORY_CONFIG.maxDescriptionLength))
    .trim()
    .optional(),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.number().positive(),
});

export const getCategoryBySlugSchema = z.object({
  slug: z.string().min(1, VALIDATION_MESSAGES.required),
});

export const deleteCategorySchema = z.object({
  id: z.number().positive(),
});

// Query validation schemas
export const getPostsSchema = z.object({
  published: z.boolean().optional(),
  categorySlug: z.string().optional(),
  search: z.string().optional(),
  page: z.number().positive().optional().default(1),
  limit: z.number().positive().max(100).optional().default(10),
});

export const getCategoryPostsSchema = z.object({
  categorySlug: z.string().min(1, VALIDATION_MESSAGES.required),
  published: z.boolean().optional().default(true),
  page: z.number().positive().optional().default(1),
  limit: z.number().positive().max(100).optional().default(10),
});

// Client-side validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Type guards
export const isValidPost = (data: any): data is z.infer<typeof createPostSchema> => {
  return createPostSchema.safeParse(data).success;
};

export const isValidCategory = (data: any): data is z.infer<typeof createCategorySchema> => {
  return createCategorySchema.safeParse(data).success;
};