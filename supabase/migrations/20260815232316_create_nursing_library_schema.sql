/*
# Create Nursing Library Database Schema

Creates the complete database for "Al-Khulasa fi Al-Tamrid" — an Arabic nursing
digital library with an admin CMS. Four tables are created:

1. New Tables
   - `resources` — study files, nursing books, and interview questions.
     Columns: id, title, description, section (study|books|interview),
     category (slug), year, subject, author, edition, tags (jsonb),
     file_name, file_path, file_url, file_size, file_type,
     cover_image_url, cover_path, status (draft|published|scheduled),
     featured, popular, download_count, view_count, scheduled_at,
     user_id, created_at, updated_at.
   - `nursing_categories` — categories per section (e.g. ICU, Emergency).
     Columns: id, name, slug, section, icon, sort, created_at.
   - `settings` — single-row JSON store for site branding/content.
     Columns: id (always 1), data (jsonb), updated_at.
   - `events` — analytics events (visits, downloads, views, newsletter).
     Columns: id, type, resource_id, path, created_at.

2. Security (RLS)
   - `resources`: public SELECT for published rows; authenticated full CRUD
     (admin manages all rows). download_count/view_count are incrementable
     by anon via a SECURITY DEFINER function (see below).
   - `nursing_categories`: public SELECT; authenticated full CRUD.
   - `settings`: public SELECT; authenticated UPDATE only.
   - `events`: anon + authenticated INSERT (anyone can track visits);
     authenticated SELECT (admin analytics).

3. Functions
   - `increment_download_count(resource_uuid)` — atomically bumps
     download_count by 1. SECURITY DEFINER so anon visitors can trigger it
     without UPDATE table privileges.
   - `increment_view_count(resource_uuid)` — same for view_count.

4. Important Notes
   - The app has a sign-in screen (admin), so public content uses
     TO anon, authenticated for SELECT, while mutations are TO authenticated.
   - `user_id` on resources defaults to auth.uid() so admin inserts work
     even when the client omits the field.
   - resource_id on events is nullable (visit/newsletter events have no
     associated resource).
*/

-- ============================================================
-- resources
-- ============================================================
CREATE TABLE IF NOT EXISTS resources (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  section       text NOT NULL DEFAULT 'study' CHECK (section IN ('study','books','interview')),
  category      text,
  year          text,
  subject       text,
  author        text,
  edition       text,
  tags          jsonb DEFAULT '[]'::jsonb,
  file_name     text,
  file_path     text,
  file_url      text,
  file_size     bigint,
  file_type     text,
  cover_image_url text,
  cover_path    text,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','scheduled')),
  featured      boolean NOT NULL DEFAULT false,
  popular       boolean NOT NULL DEFAULT false,
  download_count integer NOT NULL DEFAULT 0,
  view_count    integer NOT NULL DEFAULT 0,
  scheduled_at  timestamptz,
  user_id       uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_section ON resources(section);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(featured);
CREATE INDEX IF NOT EXISTS idx_resources_popular ON resources(popular);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Public can read published resources
DROP POLICY IF EXISTS "public_select_published_resources" ON resources;
CREATE POLICY "public_select_published_resources"
  ON resources FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Authenticated admin can read all resources (including drafts/scheduled)
DROP POLICY IF EXISTS "admin_select_all_resources" ON resources;
CREATE POLICY "admin_select_all_resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin can insert
DROP POLICY IF EXISTS "admin_insert_resources" ON resources;
CREATE POLICY "admin_insert_resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admin can update
DROP POLICY IF EXISTS "admin_update_resources" ON resources;
CREATE POLICY "admin_update_resources"
  ON resources FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated admin can delete
DROP POLICY IF EXISTS "admin_delete_resources" ON resources;
CREATE POLICY "admin_delete_resources"
  ON resources FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- nursing_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS nursing_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text NOT NULL UNIQUE,
  section    text NOT NULL DEFAULT 'study' CHECK (section IN ('study','books','interview')),
  icon       text,
  sort       integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nursing_categories_section ON nursing_categories(section);
CREATE INDEX IF NOT EXISTS idx_nursing_categories_slug ON nursing_categories(slug);

ALTER TABLE nursing_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_categories" ON nursing_categories;
CREATE POLICY "public_select_categories"
  ON nursing_categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON nursing_categories;
CREATE POLICY "admin_insert_categories"
  ON nursing_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON nursing_categories;
CREATE POLICY "admin_update_categories"
  ON nursing_categories FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON nursing_categories;
CREATE POLICY "admin_delete_categories"
  ON nursing_categories FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- settings (single-row JSON store, id = 1)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id         integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data       jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_settings" ON settings;
CREATE POLICY "public_select_settings"
  ON settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON settings;
CREATE POLICY "admin_insert_settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================
-- events (analytics: visits, downloads, views, newsletter)
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL CHECK (type IN ('visit','download','view','newsletter')),
  resource_id uuid REFERENCES resources(id) ON DELETE SET NULL,
  path        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_resource_id ON events(resource_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon visitors) can insert events for tracking
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events"
  ON events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admin can read events (analytics dashboard)
DROP POLICY IF EXISTS "admin_select_events" ON events;
CREATE POLICY "admin_select_events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Helper functions for public counter increments (SECURITY DEFINER)
-- ============================================================

-- increment_download_count: atomically bumps download_count by 1
CREATE OR REPLACE FUNCTION increment_download_count(res_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE resources SET download_count = download_count + 1 WHERE id = res_id;
END;
$$;

-- increment_view_count: atomically bumps view_count by 1
CREATE OR REPLACE FUNCTION increment_view_count(res_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE resources SET view_count = view_count + 1 WHERE id = res_id;
END;
$$;

-- Grant execute to anon + authenticated so public visitors can trigger counts
GRANT EXECUTE ON FUNCTION increment_download_count(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO anon, authenticated;

-- ============================================================
-- auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_resources_updated_at ON resources;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Seed default settings row (id = 1)
-- ============================================================
INSERT INTO settings (id, data)
VALUES (1, jsonb_build_object(
  'site_name', 'الخلاصة في التمريض',
  'tagline', 'مكتبة التمريض الرقمية',
  'logo_url', '',
  'banner_title', 'الخلاصة في التمريض',
  'banner_subtitle', 'تصفح، ابحث، وحمّل الملفات الدراسية والكتب وأسئلة الانترفيو',
  'social_links', jsonb_build_object(
    'facebook', '',
    'twitter', '',
    'instagram', '',
    'telegram', ''
  )
))
ON CONFLICT (id) DO NOTHING;
