/*
# Create professional profile tables (single-tenant, no auth)

1. New Tables
- `profiles`: id, photo_url, name, username, location, education, institution, interest_area, professional_status, about, resume_url, created_at, updated_at
- `profile_skills`: id, profile_id (FK), name
- `profile_certificates`: id, profile_id (FK), title, issuer, file_url, file_name, created_at
- `profile_courses`: id, profile_id (FK), title, institution, completion_date
- `profile_experiences`: id, profile_id (FK), title, company, start_date, end_date, description
- `profile_projects`: id, profile_id (FK), title, description, link_url

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD (single-tenant, no sign-in, data is intentionally shared/public).

3. Notes
- No user_id / auth.users references — this is a no-auth app.
- Single profile per session (the app manages one profile at a time).
- Certificate files are stored in Supabase Storage bucket 'certificates'.
- Resume PDF is generated client-side, not stored in DB.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url text,
  name text NOT NULL DEFAULT '',
  username text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  institution text NOT NULL DEFAULT '',
  interest_area text NOT NULL DEFAULT '',
  professional_status text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  resume_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS profile_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profile_skills" ON profile_skills;
CREATE POLICY "anon_select_profile_skills" ON profile_skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profile_skills" ON profile_skills;
CREATE POLICY "anon_insert_profile_skills" ON profile_skills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profile_skills" ON profile_skills;
CREATE POLICY "anon_delete_profile_skills" ON profile_skills FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS profile_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text NOT NULL DEFAULT '',
  file_url text,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profile_certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profile_certificates" ON profile_certificates;
CREATE POLICY "anon_select_profile_certificates" ON profile_certificates FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profile_certificates" ON profile_certificates;
CREATE POLICY "anon_insert_profile_certificates" ON profile_certificates FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profile_certificates" ON profile_certificates;
CREATE POLICY "anon_delete_profile_certificates" ON profile_certificates FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS profile_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  institution text NOT NULL DEFAULT '',
  completion_date text
);
ALTER TABLE profile_courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profile_courses" ON profile_courses;
CREATE POLICY "anon_select_profile_courses" ON profile_courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profile_courses" ON profile_courses;
CREATE POLICY "anon_insert_profile_courses" ON profile_courses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profile_courses" ON profile_courses;
CREATE POLICY "anon_delete_profile_courses" ON profile_courses FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS profile_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL DEFAULT '',
  start_date text,
  end_date text,
  description text NOT NULL DEFAULT ''
);
ALTER TABLE profile_experiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profile_experiences" ON profile_experiences;
CREATE POLICY "anon_select_profile_experiences" ON profile_experiences FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profile_experiences" ON profile_experiences;
CREATE POLICY "anon_insert_profile_experiences" ON profile_experiences FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profile_experiences" ON profile_experiences;
CREATE POLICY "anon_delete_profile_experiences" ON profile_experiences FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS profile_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  link_url text
);
ALTER TABLE profile_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_profile_projects" ON profile_projects;
CREATE POLICY "anon_select_profile_projects" ON profile_projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_profile_projects" ON profile_projects;
CREATE POLICY "anon_insert_profile_projects" ON profile_projects FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_profile_projects" ON profile_projects;
CREATE POLICY "anon_delete_profile_projects" ON profile_projects FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_profile_skills_profile_id ON profile_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_certificates_profile_id ON profile_certificates(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_courses_profile_id ON profile_courses(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_experiences_profile_id ON profile_experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_projects_profile_id ON profile_projects(profile_id);
