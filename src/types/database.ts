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
  featured?: boolean | number; // pin to top of Past Highlights
  slug?: string;
  country?: string; // ISO-2
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
  platform?: string; // youtube, mixcloud, spotify, soundcloud, deezer
  link?: string; // external URL to the mix/playlist
  cover_image?: string; // thumbnail URL ('' = platform fallback icon)
  audio_url?: string; // legacy, unused
  duration?: number; // legacy, unused (kept NOT NULL in schema → seeded 0)
  bpm?: number;
  genre: string; // display string, e.g. "House / Tech House"
  description?: string;
  published: boolean | number;
  featured: boolean | number;
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
