import { useEffect, useState, useCallback } from 'react';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  Share2,
  Sparkles,
  TrendingUp,
  BriefcaseBusiness,
  Newspaper,
  GraduationCap,
  HelpCircle,
  User,
  Image as ImageIcon,
  Link2,
} from 'lucide-react';
import { supabase, FEED_FILTERS, type SocialPost, type SocialComment } from '@/lib/supabase';
import { timeAgo } from '@/components/Layout';

const POST_TYPE_META: Record<string, { icon: typeof User; label: string; color: string }> = {
  user: { icon: User, label: 'Publicação', color: '#3b82f6' },
  question: { icon: HelpCircle, label: 'Pergunta', color: '#0891b2' },
  job: { icon: BriefcaseBusiness, label: 'Vaga', color: '#059669' },
  news: { icon: Newspaper, label: 'Notícia', color: '#d97706' },
  firststep: { icon: Sparkles, label: 'First Step', color: '#3b82f6' },
};

export function FeedPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('Para você');
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);

  // Composer state
  const [composerText, setComposerText] = useState('');
  const [composerType, setComposerType] = useState<string>('user');
  const [composerAuthor, setComposerAuthor] = useState('');
  const [composerRole, setComposerRole] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Track liked/saved posts locally (simple, no auth)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('social_posts').select('*').order('created_at', { ascending: false });
    if (activeFilter !== 'Para você') query = query.eq('category', activeFilter);
    const { data, error } = await query.limit(50);
    if (!error && data) setPosts(data as SocialPost[]);
    setLoading(false);
  }, [activeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePublish = async () => {
    if (!composerText.trim()) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('social_posts')
      .insert({
        content: composerText.trim(),
        post_type: composerType,
        category: 'Para você',
        author_name: composerAuthor.trim() || 'Anônimo',
        author_role: composerRole.trim(),
      })
      .select()
      .single();
    if (data) {
      setPosts((prev) => [data as SocialPost, ...prev]);
      setComposerText('');
      setComposerAuthor('');
      setComposerRole('');
      setComposerOpen(false);
    }
    setSubmitting(false);
  };

  const handleLike = async (post: SocialPost) => {
    if (likedPosts.has(post.id)) return;
    setLikedPosts((prev) => new Set(prev).add(post.id));
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p));
    await supabase.from('social_likes').insert({ post_id: post.id });
  };

  const handleSave = async (post: SocialPost) => {
    if (savedPosts.has(post.id)) {
      setSavedPosts((prev) => { const s = new Set(prev); s.delete(post.id); return s; });
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, saves_count: Math.max(p.saves_count - 1, 0) } : p));
      await supabase.from('social_saves').delete().eq('post_id', post.id).limit(1);
    } else {
      setSavedPosts((prev) => new Set(prev).add(post.id));
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, saves_count: p.saves_count + 1 } : p));
      await supabase.from('social_saves').insert({ post_id: post.id });
    }
  };

  const handleShare = async (post: SocialPost) => {
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, shares_count: p.shares_count + 1 } : p));
    await supabase.from('social_posts').update({ shares_count: post.shares_count + 1 }).eq('id', post.id);
  };

  return (
    <section className="feed-page">
      <div className="feed-layout">
        {/* Left sidebar */}
        <aside className="feed-sidebar feed-sidebar-left">
          <div className="feed-profile-card">
            <div className="feed-profile-banner" />
            <div className="feed-profile-body">
              <div className="feed-profile-avatar"><Sparkles size={20} /></div>
              <h3>Olá, jovem talento</h3>
              <p>Dê o primeiro passo e compartilhe sua jornada com a comunidade.</p>
            </div>
          </div>
          <nav className="feed-sidebar-nav">
            {FEED_FILTERS.map((filter) => {
              const icons: Record<string, typeof TrendingUp> = {
                'Para você': TrendingUp,
                'Notícias': Newspaper,
                'Vagas': BriefcaseBusiness,
                'Estudos': GraduationCap,
                'Carreira': BriefcaseBusiness,
                'Cursos': GraduationCap,
              };
              const Icon = icons[filter] || TrendingUp;
              return (
                <button
                  key={filter}
                  className={activeFilter === filter ? 'active' : ''}
                  onClick={() => setActiveFilter(filter)}
                >
                  <Icon size={17} />
                  {filter}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main feed */}
        <div className="feed-main">
          {/* Filter tabs (mobile + top) */}
          <div className="feed-filter-tabs">
            {FEED_FILTERS.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? 'active' : ''}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="feed-composer">
            <div className="feed-composer-avatar"><Sparkles size={18} /></div>
            {composerOpen ? (
              <div className="feed-composer-expanded">
                <input
                  className="form-input"
                  placeholder="Seu nome (opcional)"
                  value={composerAuthor}
                  onChange={(e) => setComposerAuthor(e.target.value)}
                />
                <input
                  className="form-input"
                  placeholder="Seu cargo ou situação (ex: Estudante, Estagiário)"
                  value={composerRole}
                  onChange={(e) => setComposerRole(e.target.value)}
                />
                <textarea
                  className="form-textarea"
                  placeholder="Compartilhe algo com a comunidade..."
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className="feed-composer-bar">
                  <div className="feed-composer-types">
                    {[
                      { value: 'user', label: 'Publicação', icon: User },
                      { value: 'question', label: 'Pergunta', icon: HelpCircle },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        className={composerType === value ? 'active' : ''}
                        onClick={() => setComposerType(value)}
                      >
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                  </div>
                  <div className="feed-composer-actions">
                    <button className="feed-composer-tool" title="Em breve"><ImageIcon size={17} /></button>
                    <button className="feed-composer-tool" title="Em breve"><Link2 size={17} /></button>
                    <button
                      className="button button-ghost button-small"
                      onClick={() => { setComposerOpen(false); setComposerText(''); }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="button button-blue button-small"
                      onClick={handlePublish}
                      disabled={submitting || !composerText.trim()}
                    >
                      <Send size={14} /> {submitting ? 'Publicando...' : 'Publicar'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button className="feed-composer-trigger" onClick={() => setComposerOpen(true)}>
                Compartilhe uma experiência, dúvida ou conquista...
              </button>
            )}
          </div>

          {/* Posts */}
          {loading ? (
            <div className="feed-loading">
              <div className="feed-skeleton" />
              <div className="feed-skeleton" />
              <div className="feed-skeleton" />
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state-card">
              <Sparkles size={36} />
              <h3>Nada por aqui ainda</h3>
              <p>Não há publicações neste filtro. Que tal ser o primeiro a compartilhar?</p>
            </div>
          ) : (
            <div className="feed-posts">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  liked={likedPosts.has(post.id)}
                  saved={savedPosts.has(post.id)}
                  onLike={() => handleLike(post)}
                  onSave={() => handleSave(post)}
                  onShare={() => handleShare(post)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="feed-sidebar feed-sidebar-right">
          <div className="feed-trending-card">
            <div className="sidebar-header">
              <TrendingUp size={17} className="text-blue-450" />
              <h3>Em alta agora</h3>
            </div>
            {posts.slice(0, 4).map((post, i) => {
              const meta = POST_TYPE_META[post.post_type] || POST_TYPE_META.user;
              const Icon = meta.icon;
              return (
                <div key={post.id} className="feed-trending-item">
                  <span className="feed-trending-rank">#{i + 1}</span>
                  <div>
                    <span className="feed-trending-type"><Icon size={11} /> {meta.label}</span>
                    <p>{post.content.slice(0, 80)}{post.content.length > 80 ? '...' : ''}</p>
                    <span className="feed-trending-likes"><Heart size={11} /> {post.likes_count}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="feed-promo-card">
            <div className="feed-promo-icon"><GraduationCap size={22} /></div>
            <h3>Cursos SENAC gratuitos</h3>
            <p>Inscrições abertas para cursos técnicos e profissionalizantes.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
}: {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const meta = POST_TYPE_META[post.post_type] || POST_TYPE_META.user;
  const TypeIcon = meta.icon;

  const fetchComments = async () => {
    setLoadingComments(true);
    const { data } = await supabase
      .from('social_comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    if (data) setComments(data as SocialComment[]);
    setLoadingComments(false);
  };

  const handleToggleComments = () => {
    if (!showComments && comments.length === 0) fetchComments();
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    const { data } = await supabase
      .from('social_comments')
      .insert({
        post_id: post.id,
        content: commentText.trim(),
        author_name: commentAuthor.trim() || 'Anônimo',
      })
      .select()
      .single();
    if (data) {
      setComments((prev) => [...prev, data as SocialComment]);
      setCommentText('');
      setCommentAuthor('');
    }
    setSubmittingComment(false);
  };

  return (
    <article className="feed-post">
      <div className="feed-post-header">
        <div className="feed-post-avatar" style={{ background: avatarColor(post.author_name) }}>
          {post.author_name.charAt(0).toUpperCase()}
        </div>
        <div className="feed-post-author">
          <div className="feed-post-name">
            {post.author_name}
            {post.author_role && <span className="feed-post-role">{post.author_role}</span>}
          </div>
          <div className="feed-post-sub">
            <span className="feed-post-type" style={{ color: meta.color }}>
              <TypeIcon size={11} /> {meta.label}
            </span>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="feed-post-content">{post.content}</div>

      <div className="feed-post-actions">
        <button
          className={`feed-action ${liked ? 'liked' : ''}`}
          onClick={onLike}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          <span>{post.likes_count}</span>
        </button>
        <button
          className="feed-action"
          onClick={handleToggleComments}
        >
          <MessageCircle size={16} />
          <span>{post.comments_count}</span>
        </button>
        <button className="feed-action" onClick={onShare}>
          <Repeat2 size={16} />
          <span>{post.shares_count}</span>
        </button>
        <button
          className={`feed-action feed-action-save ${saved ? 'saved' : ''}`}
          onClick={onSave}
        >
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
          <span>{post.saves_count}</span>
        </button>
        <button className="feed-action feed-action-share" onClick={onShare}>
          <Share2 size={16} />
        </button>
      </div>

      {showComments && (
        <div className="feed-post-comments">
          <div className="feed-comment-form">
            <input
              className="form-input feed-comment-input"
              placeholder="Seu nome (opcional)"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
            />
            <div className="feed-comment-row">
              <input
                className="form-input feed-comment-input"
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
              />
              <button
                className="button button-blue button-small"
                onClick={handleAddComment}
                disabled={submittingComment || !commentText.trim()}
              >
                <Send size={13} />
              </button>
            </div>
          </div>
          {loadingComments ? (
            <p className="empty-state" style={{ padding: '16px 0' }}>Carregando comentários...</p>
          ) : comments.length === 0 ? (
            <p className="empty-state" style={{ padding: '16px 0' }}>Seja o primeiro a comentar!</p>
          ) : (
            <div className="feed-comment-list">
              {comments.map((c) => (
                <div key={c.id} className="feed-comment">
                  <div className="feed-comment-avatar" style={{ background: avatarColor(c.author_name) }}>
                    {c.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="feed-comment-body">
                    <div className="feed-comment-meta">
                      <strong>{c.author_name}</strong>
                      <span>{timeAgo(c.created_at)}</span>
                    </div>
                    <p>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function avatarColor(name: string): string {
  const colors = ['#1d4ed8', '#0e7490', '#059669', '#7c3aed', '#c2410c', '#be185d', '#1e40af', '#0f766e'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
