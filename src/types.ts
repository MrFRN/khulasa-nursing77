export type Section = 'study' | 'books' | 'interview';
export type ResourceStatus = 'draft' | 'published' | 'scheduled';

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  section: Section;
  category: string | null;
  year: string | null;
  subject: string | null;
  author: string | null;
  edition: string | null;
  tags: string[];
  file_name: string | null;
  file_path: string | null;
  file_url: string | null;
  file_size: number | null;
  file_type: string | null;
  cover_image_url: string | null;
  cover_path: string | null;
  status: ResourceStatus;
  featured: boolean;
  popular: boolean;
  download_count: number;
  view_count: number;
  scheduled_at: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NursingCategory {
  id: string;
  name: string;
  slug: string;
  section: Section;
  icon: string | null;
  sort: number;
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  logo_url: string;
  banner_title: string;
  banner_subtitle: string;
  banner_image_url: string;
  social_links: {
    facebook: string;
    twitter: string;
    instagram: string;
    telegram: string;
  };
  [key: string]: unknown;
}

export interface AuthUser {
  id: string;
  email: string;
}

export type EventType = 'visit' | 'download' | 'view' | 'newsletter';

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  resource_id: string | null;
  path: string | null;
  created_at: string;
}
