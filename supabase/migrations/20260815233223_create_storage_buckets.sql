/*
# Create Storage Buckets

Creates three public storage buckets for the nursing library:
- `files` — uploaded PDF files and study materials
- `covers` — auto-generated cover images from PDF first pages
- `media` — miscellaneous media (logos, banners, etc.)

All buckets are public-read so visitors can preview/download files
without authentication. Writes are controlled by storage policies.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('files', 'files', true),
  ('covers', 'covers', true),
  ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for all three buckets
CREATE POLICY "public_read_files" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'files');

CREATE POLICY "public_read_covers" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'covers');

CREATE POLICY "public_read_media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

-- Authenticated users can upload to all buckets (admin uploads)
CREATE POLICY "auth_upload_files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'files');

CREATE POLICY "auth_upload_covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'covers');

CREATE POLICY "auth_upload_media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Authenticated users can update/delete in all buckets
CREATE POLICY "auth_update_files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'files') WITH CHECK (bucket_id = 'files');

CREATE POLICY "auth_delete_files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'files');

CREATE POLICY "auth_update_covers" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'covers') WITH CHECK (bucket_id = 'covers');

CREATE POLICY "auth_delete_covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'covers');

CREATE POLICY "auth_update_media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

CREATE POLICY "auth_delete_media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
