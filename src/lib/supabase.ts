import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ForumPost = {
  id: string;
  category: string;
  title: string;
  content: string;
  author_name: string;
  votes: number;
  created_at: string;
};

export type ForumComment = {
  id: string;
  post_id: string;
  content: string;
  author_name: string;
  created_at: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  area: string;
  location: string;
  modality: string;
  job_type: string;
  description: string;
  external_url: string | null;
  source: string;
  created_at: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  source_url: string | null;
  published_at: string;
  is_featured: boolean;
  category: string;
};

export type SenacOpportunity = {
  id: string;
  title: string;
  description: string;
  category: string;
  external_url: string | null;
  created_at: string;
};

export const FORUM_CATEGORIES = ['Estudos', 'Trabalho', 'Currículo', 'Entrevistas', 'Carreira', 'Cursos'] as const;
export const NEWS_CATEGORIES = ['Mercado', 'Cursos', 'Estágios', 'Processos seletivos', 'Oportunidades'] as const;
export const JOB_TYPES = ['Primeiro emprego', 'Estágio', 'Aprendiz', 'Efetivo'] as const;
export const JOB_MODALITIES = ['Presencial', 'Híbrido', 'Remoto'] as const;
export const SENAC_CATEGORIES = ['Estágio', 'Curso', 'Carreira'] as const;

export type SocialPost = {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  post_type: string;
  category: string;
  link_url: string | null;
  link_title: string | null;
  link_source: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  created_at: string;
};

export type SocialComment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

export const FEED_FILTERS = ['Para você', 'Notícias', 'Vagas', 'Estudos', 'Carreira', 'Cursos'] as const;
export const POST_TYPES = [
  { value: 'user', label: 'Publicação' },
  { value: 'question', label: 'Pergunta' },
] as const;

export type Profile = {
  id: string;
  photo_url: string | null;
  name: string;
  username: string;
  location: string;
  education: string;
  institution: string;
  interest_area: string;
  professional_status: string;
  about: string;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileSkill = { id: string; profile_id: string; name: string; sort_order: number };
export type ProfileCertificate = { id: string; profile_id: string; title: string; issuer: string; file_url: string | null; file_name: string | null; created_at: string };
export type ProfileCourse = { id: string; profile_id: string; title: string; institution: string; completion_date: string | null };
export type ProfileExperience = { id: string; profile_id: string; title: string; company: string; start_date: string | null; end_date: string | null; description: string };
export type ProfileProject = { id: string; profile_id: string; title: string; description: string; link_url: string | null };

export type Ebook = {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  file_url: string | null;
  sort_order: number;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  instructor: string;
  sort_order: number;
  created_at: string;
};

export type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  youtube_url: string | null;
  sort_order: number;
};

export type CourseProgress = {
  id: string;
  course_id: string;
  module_id: string;
  completed: boolean;
  updated_at: string;
};

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  item_type: string;
  category: string;
  source: string;
  created_at: string;
};

export const CONTENT_CATEGORIES = ['Todos', 'Currículo', 'Entrevistas', 'Vagas', 'Carreira', 'Estudos', 'Cursos', 'Primeiro emprego', 'Processos seletivos'] as const;
export const CONTENT_TYPES = [
  { value: 'article', label: 'Artigo' },
  { value: 'video', label: 'Vídeo' },
  { value: 'site', label: 'Site' },
  { value: 'material', label: 'Material' },
] as const;

export const AI_TOPICS = [
  { icon: 'FileText', label: 'Currículos' },
  { icon: 'MessageCircle', label: 'Entrevistas' },
  { icon: 'Briefcase', label: 'Primeiro emprego' },
  { icon: 'GraduationCap', label: 'Estágios' },
  { icon: 'TrendingUp', label: 'Carreira' },
  { icon: 'BookOpen', label: 'Estudos' },
  { icon: 'Calendar', label: 'Organização' },
  { icon: 'Sparkles', label: 'Desenvolvimento profissional' },
] as const;
