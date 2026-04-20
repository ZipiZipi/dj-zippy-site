// TypeScript types for D1 database tables

export interface Event {
  id: number;
  title: string;
  location: string;
  date: string; // YYYY-MM-DD
  status: 'upcoming' | 'past';
  link?: string;
  subtitle?: string;
  time?: string; // HH:mm
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  cover_image?: string; // R2 URL
  content: string; // Markdown
  date: string; // YYYY-MM-DD
  seo_description: string;
  author?: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mix {
  id: number;
  title: string;
  slug: string;
  cover_image?: string; // R2 URL
  audio_url?: string; // R2 URL
  duration: number; // minutes
  bpm?: number;
  genre: string; // tech-house, deep-house, house, etc.
  description?: string;
  date: string; // YYYY-MM-DD
  published: boolean;
  featured: boolean;
  download_count?: number;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    count?: number;
    page?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    count: number;
    page: number;
    total: number;
    pages: number;
  };
}
