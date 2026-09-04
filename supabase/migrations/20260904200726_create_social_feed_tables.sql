/*
# Create social feed tables (single-tenant, no auth)

1. New Tables
- `social_posts`: id, author_name, author_role, content, post_type, category, likes_count, comments_count, shares_count, saves_count, created_at
  - post_type: 'user' (user publication), 'question' (question/discussion), 'job' (job/opportunity), 'news' (news article), 'firststep' (First Step content)
  - category: 'Para você', 'Notícias', 'Vagas', 'Estudos', 'Carreira', 'Cursos'
- `social_comments`: id, post_id (FK), author_name, content, created_at
- `social_likes`: id, post_id (FK), created_at — one row per like (simple counter, no user isolation needed for single-tenant)
- `social_saves`: id, post_id (FK), created_at — one row per save

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD (single-tenant, no sign-in, data is intentionally shared/public).

3. Notes
- No user_id / auth.users references — this is a no-auth app.
- Likes and saves are simple counter tables: each insert increments the post's count column via a trigger.
- Triggers maintain likes_count, comments_count, shares_count, saves_count on the parent post.
*/

CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL DEFAULT 'Anônimo',
  author_role text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  post_type text NOT NULL DEFAULT 'user' CHECK (post_type IN ('user','question','job','news','firststep')),
  category text NOT NULL DEFAULT 'Para você' CHECK (category IN ('Para você','Notícias','Vagas','Estudos','Carreira','Cursos')),
  link_url text,
  link_title text,
  link_source text,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  shares_count integer NOT NULL DEFAULT 0,
  saves_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_social_posts" ON social_posts;
CREATE POLICY "anon_select_social_posts" ON social_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_social_posts" ON social_posts;
CREATE POLICY "anon_insert_social_posts" ON social_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_social_posts" ON social_posts;
CREATE POLICY "anon_update_social_posts" ON social_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_social_posts" ON social_posts;
CREATE POLICY "anon_delete_social_posts" ON social_posts FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS social_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT 'Anônimo',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_social_comments" ON social_comments;
CREATE POLICY "anon_select_social_comments" ON social_comments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_social_comments" ON social_comments;
CREATE POLICY "anon_insert_social_comments" ON social_comments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_social_comments" ON social_comments;
CREATE POLICY "anon_delete_social_comments" ON social_comments FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS social_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_social_likes" ON social_likes;
CREATE POLICY "anon_select_social_likes" ON social_likes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_social_likes" ON social_likes;
CREATE POLICY "anon_insert_social_likes" ON social_likes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_social_likes" ON social_likes;
CREATE POLICY "anon_delete_social_likes" ON social_likes FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS social_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE social_saves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_social_saves" ON social_saves;
CREATE POLICY "anon_select_social_saves" ON social_saves FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_social_saves" ON social_saves;
CREATE POLICY "anon_insert_social_saves" ON social_saves FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_social_saves" ON social_saves;
CREATE POLICY "anon_delete_social_saves" ON social_saves FOR DELETE TO anon, authenticated USING (true);

-- Triggers to keep counts in sync
CREATE OR REPLACE FUNCTION increment_social_count() RETURNS trigger AS $$
BEGIN
  IF TG_TABLE_NAME = 'social_comments' THEN
    UPDATE social_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_TABLE_NAME = 'social_likes' THEN
    UPDATE social_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_TABLE_NAME = 'social_saves' THEN
    UPDATE social_posts SET saves_count = saves_count + 1 WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_social_count() RETURNS trigger AS $$
BEGIN
  IF TG_TABLE_NAME = 'social_comments' THEN
    UPDATE social_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  ELSIF TG_TABLE_NAME = 'social_likes' THEN
    UPDATE social_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  ELSIF TG_TABLE_NAME = 'social_saves' THEN
    UPDATE social_posts SET saves_count = GREATEST(saves_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_social_comments_insert ON social_comments;
CREATE TRIGGER trg_social_comments_insert AFTER INSERT ON social_comments
  FOR EACH ROW EXECUTE FUNCTION increment_social_count();

DROP TRIGGER IF EXISTS trg_social_comments_delete ON social_comments;
CREATE TRIGGER trg_social_comments_delete AFTER DELETE ON social_comments
  FOR EACH ROW EXECUTE FUNCTION decrement_social_count();

DROP TRIGGER IF EXISTS trg_social_likes_insert ON social_likes;
CREATE TRIGGER trg_social_likes_insert AFTER INSERT ON social_likes
  FOR EACH ROW EXECUTE FUNCTION increment_social_count();

DROP TRIGGER IF EXISTS trg_social_likes_delete ON social_likes;
CREATE TRIGGER trg_social_likes_delete AFTER DELETE ON social_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_social_count();

DROP TRIGGER IF EXISTS trg_social_saves_insert ON social_saves;
CREATE TRIGGER trg_social_saves_insert AFTER INSERT ON social_saves
  FOR EACH ROW EXECUTE FUNCTION increment_social_count();

DROP TRIGGER IF EXISTS trg_social_saves_delete ON social_saves;
CREATE TRIGGER trg_social_saves_delete AFTER DELETE ON social_saves
  FOR EACH ROW EXECUTE FUNCTION decrement_social_count();

CREATE INDEX IF NOT EXISTS idx_social_posts_category ON social_posts(category);
CREATE INDEX IF NOT EXISTS idx_social_posts_created ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_comments_post_id ON social_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_social_likes_post_id ON social_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_social_saves_post_id ON social_saves(post_id);
