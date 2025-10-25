// Application constants
export const APP_CONFIG = {
  name: 'Postly',
  description: 'A modern blog platform built with Next.js and tRPC',
  version: '1.0.0',
  author: 'Postly Team',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  retries: 3,
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultPage: 1,
} as const;

// Post configuration
export const POST_CONFIG = {
  maxTitleLength: 200,
  maxContentLength: 50000,
  maxAuthorLength: 100,
  slugMaxLength: 200,
  defaultAuthor: 'Anonymous',
  readingWordsPerMinute: 200,
} as const;

// Category configuration
export const CATEGORY_CONFIG = {
  maxNameLength: 50,
  maxDescriptionLength: 500,
  slugMaxLength: 100,
} as const;

// Image configuration
export const IMAGE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxWidth: 1920,
  maxHeight: 1080,
  defaultWidth: 600,
  defaultHeight: 400,
} as const;

// Toast configuration
export const TOAST_CONFIG = {
  defaultDuration: 5000,
  maxToasts: 5,
  position: 'top-right',
} as const;

// Theme configuration
export const THEME_CONFIG = {
  default: 'system',
  storageKey: 'postly-theme',
} as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  email: 'Please enter a valid email address',
  url: 'Please enter a valid URL',
  slug: 'Only letters, numbers, and hyphens are allowed',
} as const;

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_PUBLISHED: 'Post published successfully',
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CATEGORIES: '/categories',
  CREATE_POST: '/posts/create',
  EDIT_POST: (id: number) => `/edit/${id}`,
  VIEW_POST: (slug: string) => `/posts/${slug}`,
  CATEGORY_POSTS: (slug: string) => `/categories/${slug}`,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'postly-theme',
  DRAFT: 'postly-draft',
  USER_PREFERENCES: 'postly-preferences',
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SAVE: 'Ctrl+S',
  PREVIEW: 'Ctrl+P',
  PUBLISH: 'Ctrl+Shift+P',
  BOLD: 'Ctrl+B',
  ITALIC: 'Ctrl+I',
  UNDERLINE: 'Ctrl+U',
  LINK: 'Ctrl+K',
  CODE: 'Ctrl+E',
} as const;