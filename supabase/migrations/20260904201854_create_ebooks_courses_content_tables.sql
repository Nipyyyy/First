/*
# Create ebooks, courses, content center tables (single-tenant, no auth)

1. New Tables
- `ebooks`: id, title, description, cover_url, file_url, sort_order, created_at
- `courses`: id, title, description, cover_url, instructor, sort_order, created_at
- `course_modules`: id, course_id (FK), title, youtube_url, sort_order
- `course_progress`: id, course_id (FK), module_id (FK), completed, updated_at
  - Single-row per (course_id, module_id) — tracks which modules the user has completed
- `content_items`: id, title, description, url, item_type (article/video/site/material), category, source, created_at

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD (single-tenant, no sign-in, data is intentionally shared/public).

3. Notes
- No user_id / auth.users references — this is a no-auth app.
- Course progress is shared (single user model).
- E-book covers and files are placeholder URLs to be replaced later.
- Course modules have youtube_url field for embedding YouTube videos.
*/

CREATE TABLE IF NOT EXISTS ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_url text,
  file_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_ebooks" ON ebooks;
CREATE POLICY "anon_select_ebooks" ON ebooks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ebooks" ON ebooks;
CREATE POLICY "anon_insert_ebooks" ON ebooks FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_ebooks" ON ebooks;
CREATE POLICY "anon_update_ebooks" ON ebooks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ebooks" ON ebooks;
CREATE POLICY "anon_delete_ebooks" ON ebooks FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_url text,
  instructor text NOT NULL DEFAULT 'Equipe First Step',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_courses" ON courses;
CREATE POLICY "anon_select_courses" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_courses" ON courses;
CREATE POLICY "anon_insert_courses" ON courses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_courses" ON courses;
CREATE POLICY "anon_update_courses" ON courses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_courses" ON courses;
CREATE POLICY "anon_delete_courses" ON courses FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_url text,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_course_modules" ON course_modules;
CREATE POLICY "anon_select_course_modules" ON course_modules FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_course_modules" ON course_modules;
CREATE POLICY "anon_insert_course_modules" ON course_modules FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_course_modules" ON course_modules;
CREATE POLICY "anon_update_course_modules" ON course_modules FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_course_modules" ON course_modules;
CREATE POLICY "anon_delete_course_modules" ON course_modules FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, module_id)
);
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_course_progress" ON course_progress;
CREATE POLICY "anon_select_course_progress" ON course_progress FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_course_progress" ON course_progress;
CREATE POLICY "anon_insert_course_progress" ON course_progress FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_course_progress" ON course_progress;
CREATE POLICY "anon_update_course_progress" ON course_progress FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_course_progress" ON course_progress;
CREATE POLICY "anon_delete_course_progress" ON course_progress FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  url text,
  item_type text NOT NULL DEFAULT 'article' CHECK (item_type IN ('article','video','site','material')),
  category text NOT NULL DEFAULT 'Geral',
  source text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_content_items" ON content_items;
CREATE POLICY "anon_select_content_items" ON content_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_content_items" ON content_items;
CREATE POLICY "anon_insert_content_items" ON content_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_content_items" ON content_items;
CREATE POLICY "anon_update_content_items" ON content_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_content_items" ON content_items;
CREATE POLICY "anon_delete_content_items" ON content_items FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category);
