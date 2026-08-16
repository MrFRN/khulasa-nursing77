import { supabase } from './supabase';
import type { Resource, NursingCategory, SiteSettings, EventType } from '../types';

function getServiceKey(): string {
  return (
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
    (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    ''
  );
}

function getApiBase(): string {
  return import.meta.env.VITE_SUPABASE_URL || '';
}

// --- Resources ---

export async function fetchResources(opts?: {
  section?: string;
  category?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}): Promise<{ data: Resource[]; count: number }> {
  let query = supabase.from('resources').select('*', { count: 'exact' });

  if (opts?.section) query = query.eq('section', opts.section);
  if (opts?.category) query = query.eq('category', opts.category);
  if (opts?.status) {
    query = query.eq('status', opts.status);
  } else {
    query = query.eq('status', 'published');
  }
  if (opts?.search) {
    query = query.or(`title.ilike.%${opts.search}%,description.ilike.%${opts.search}%,subject.ilike.%${opts.search}%,author.ilike.%${opts.search}%`);
  }

  const orderBy = opts?.orderBy || 'created_at';
  const ascending = opts?.ascending ?? false;
  query = query.order(orderBy, { ascending });

  if (opts?.limit) {
    query = query.range(opts.offset || 0, (opts.offset || 0) + opts.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: (data as Resource[]) || [], count: count || 0 };
}

export async function fetchResourceById(id: string): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Resource | null;
}

export async function fetchFeaturedResources(limit = 6): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as Resource[]) || [];
}

export async function fetchPopularResources(limit = 6): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('download_count', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as Resource[]) || [];
}

export async function fetchRecentResources(limit = 8): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as Resource[]) || [];
}

// --- Admin: Resource CRUD ---

export async function adminFetchResources(opts?: {
  section?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Resource[]; count: number }> {
  let query = supabase.from('resources').select('*', { count: 'exact' });
  if (opts?.section) query = query.eq('section', opts.section);
  if (opts?.status) query = query.eq('status', opts.status);
  if (opts?.search) {
    query = query.or(`title.ilike.%${opts.search}%,description.ilike.%${opts.search}%`);
  }
  query = query.order('created_at', { ascending: false });
  if (opts?.limit) {
    query = query.range(opts.offset || 0, (opts.offset || 0) + opts.limit - 1);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return { data: (data as Resource[]) || [], count: count || 0 };
}

export async function adminCreateResource(
  resource: Partial<Resource>
): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .insert(resource)
    .select()
    .single();
  if (error) throw error;
  return data as Resource;
}

export async function adminUpdateResource(
  id: string,
  updates: Partial<Resource>
): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Resource;
}

export async function adminDeleteResource(id: string): Promise<void> {
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) throw error;
}

// --- Categories ---

export async function fetchCategories(section?: string): Promise<NursingCategory[]> {
  let query = supabase.from('nursing_categories').select('*').order('sort', { ascending: true });
  if (section) query = query.eq('section', section);
  const { data, error } = await query;
  if (error) throw error;
  return (data as NursingCategory[]) || [];
}

export async function adminCreateCategory(cat: Partial<NursingCategory>): Promise<NursingCategory> {
  const { data, error } = await supabase
    .from('nursing_categories')
    .insert(cat)
    .select()
    .single();
  if (error) throw error;
  return data as NursingCategory;
}

export async function adminUpdateCategory(
  id: string,
  updates: Partial<NursingCategory>
): Promise<NursingCategory> {
  const { data, error } = await supabase
    .from('nursing_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as NursingCategory;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('nursing_categories').delete().eq('id', id);
  if (error) throw error;
}

// --- Settings ---

export async function fetchSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data.data as SiteSettings;
}

export async function adminUpdateSettings(settings: SiteSettings): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('settings')
    .update({ data: settings })
    .eq('id', 1)
    .select('data')
    .single();
  if (error) throw error;
  return data.data as SiteSettings;
}

// --- Events / Analytics ---

export async function trackEvent(type: EventType, resource_id?: string, path?: string): Promise<void> {
  try {
    await supabase.from('events').insert({
      type,
      resource_id: resource_id || null,
      path: path || window.location.pathname,
    });
  } catch {
    // silently ignore tracking errors
  }
}

export async function incrementDownload(resourceId: string): Promise<void> {
  try {
    await supabase.rpc('increment_download_count', { res_id: resourceId });
  } catch {
    // ignore
  }
}

export async function incrementView(resourceId: string): Promise<void> {
  try {
    await supabase.rpc('increment_view_count', { res_id: resourceId });
  } catch {
    // ignore
  }
}

// --- Storage / Upload ---

export async function getSignedUploadUrl(
  bucket: string,
  filePath: string
): Promise<{ signedUrl: string; path: string }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(filePath);
  if (error) throw error;
  return { signedUrl: data.signedUrl, path: data.path };
}

export async function uploadFile(
  bucket: string,
  filePath: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ path: string; publicUrl: string }> {
  // Use direct upload via supabase-js (supports progress via fetch fallback)
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (onProgress) onProgress(100);

  return { path: data.path, publicUrl: urlData.publicUrl };
}

export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw error;
}

export function getPublicUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

// --- Analytics Dashboard ---

export async function fetchAnalytics(): Promise<{
  totalVisits: number;
  totalDownloads: number;
  totalViews: number;
  recentEvents: { date: string; visits: number; downloads: number; views: number }[];
}> {
  const { count: totalVisits } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'visit');

  const { count: totalDownloads } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'download');

  const { count: totalViews } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'view');

  // Last 14 days activity
  const since = new Date();
  since.setDate(since.getDate() - 14);
  const { data: events } = await supabase
    .from('events')
    .select('type, created_at')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  const dayMap = new Map<string, { visits: number; downloads: number; views: number }>();
  for (const ev of events || []) {
    const date = new Date(ev.created_at).toLocaleDateString('en-CA');
    const entry = dayMap.get(date) || { visits: 0, downloads: 0, views: 0 };
    if (ev.type === 'visit') entry.visits++;
    else if (ev.type === 'download') entry.downloads++;
    else if (ev.type === 'view') entry.views++;
    dayMap.set(date, entry);
  }

  const recentEvents = Array.from(dayMap.entries()).map(([date, v]) => ({
    date,
    ...v,
  }));

  return {
    totalVisits: totalVisits || 0,
    totalDownloads: totalDownloads || 0,
    totalViews: totalViews || 0,
    recentEvents,
  };
}

export async function fetchStorageUsage(): Promise<{ totalSize: number; fileCount: number }> {
  // Count resources with file sizes
  const { data, error } = await supabase
    .from('resources')
    .select('file_size');
  if (error) return { totalSize: 0, fileCount: 0 };
  const resources = data || [];
  const totalSize = resources.reduce((sum, r) => sum + (r.file_size || 0), 0);
  return { totalSize, fileCount: resources.length };
}

// Suppress unused warning for internal helpers
void getServiceKey;
void getApiBase;
