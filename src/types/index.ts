// Core types for the application
export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: string | null;
  image: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithCategories extends Post {
  categories: Category[];
}

// UI Component Props
export interface BlogCardProps {
  post: {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    image: string;
    slug?: string;
    content?: string;
    categories?: Category[];
  };
}

export interface NavigationProps {
  className?: string;
}

// Form types
export interface CreatePostInput {
  title: string;
  content: string;
  author?: string;
  image?: string;
  published?: boolean;
  categoryIds?: number[];
}

export interface UpdatePostInput extends CreatePostInput {
  id: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  id: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search types
export interface PostFilters {
  published?: boolean;
  categorySlug?: string;
  search?: string;
  authorId?: number;
}

// Toast notification types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Modal types
export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

// Rich text editor types
export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ImageData {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  alignment: 'left' | 'center' | 'right';
  caption?: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}