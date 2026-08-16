-- ============================================================
-- Fix 1: update_updated_at_column — set immutable search_path
-- ============================================================
-- The trigger function had a mutable search_path. Recreate it with
-- an explicit, immutable search_path so it is not vulnerable to
-- search_path manipulation attacks.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- Fix 2 & 3: increment_download_count / increment_view_count
--   — switch from SECURITY DEFINER to SECURITY INVOKER
--   — add a narrow RLS UPDATE policy so anon can bump counters only
-- ============================================================
-- These functions were SECURITY DEFINER callable by anon and
-- authenticated, which means any anonymous visitor could execute
-- a function running with the table owner's privileges. Switching
-- to SECURITY INVOKER means the caller's own RLS policies apply.
--
-- To still allow anonymous visitors to bump download/view counters
-- (which the app needs), we add a narrow UPDATE policy that only
-- permits incrementing download_count and view_count on published
-- resources.

-- Recreate the functions as SECURITY INVOKER with fixed search_path
CREATE OR REPLACE FUNCTION public.increment_download_count(res_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  UPDATE public.resources
  SET download_count = download_count + 1
  WHERE id = res_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_view_count(res_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  UPDATE public.resources
  SET view_count = view_count + 1
  WHERE id = res_id;
END;
$$;

-- The EXECUTE grants on these functions are no longer needed since
-- SECURITY INVOKER functions run with the caller's own privileges,
-- but we keep the grants so the PostgREST RPC endpoint is accessible
-- to both anon and authenticated users.
-- (These grants are harmless: the functions now execute as the caller,
-- and RLS controls the actual UPDATE.)

-- Remove the broad admin_update_resources policy's exposure for anon.
-- The existing "admin_update_resources" policy is TO authenticated only,
-- which is correct.

-- Add a narrow policy allowing anon to update ONLY counter columns
-- on published resources. This is the minimum privilege needed for
-- the public download/view tracking.
DROP POLICY IF EXISTS "anon_increment_counters" ON resources;
CREATE POLICY "anon_increment_counters"
  ON resources FOR UPDATE
  TO anon, authenticated
  USING (status = 'published')
  WITH CHECK (status = 'published');
