import { useEffect, useState } from 'react';
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Flame,
  MessageCircle,
  Plus,
  Send,
  TrendingUp,
} from 'lucide-react';
import { supabase, FORUM_CATEGORIES, type ForumPost, type ForumComment } from '@/lib/supabase';
import { PageHero, timeAgo } from '@/components/Layout';

export function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [trending, setTrending] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Estudos');
  const [newAuthor, setNewAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase.from('forum_posts').select('*').order('created_at', { ascending: false });
    if (activeCategory !== 'Todas') query = query.eq('category', activeCategory);
    const { data, error } = await query;
    if (!error && data) setPosts(data as ForumPost[]);
    setLoading(false);
  };

  const fetchTrending = async () => {
    const { data } = await supabase
      .from('forum_posts')
      .select('*')
      .order('votes', { ascending: false })
      .limit(4);
    if (data) setTrending(data as ForumPost[]);
  };

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, [activeCategory]);

  const handleVote = async (post: ForumPost) => {
    const newVotes = post.votes + 1;
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, votes: newVotes } : p)));
    if (selectedPost?.id === post.id) setSelectedPost({ ...selectedPost, votes: newVotes });
    setTrending((prev) => prev.map((p) => (p.id === post.id ? { ...p, votes: newVotes } : p)));
    await supabase.from('forum_posts').update({ votes: newVotes }).eq('id', post.id);
  };

  const handleSubmitPost = async () => {
    if (!newTitle.trim()) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('forum_posts')
      .insert({
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        author_name: newAuthor.trim() || 'Anônimo',
      })
      .select()
      .single();
    if (data) {
      setNewTitle('');
      setNewContent('');
      setNewAuthor('');
      setShowNewForm(false);
      fetchPosts();
      fetchTrending();
    }
    setSubmitting(false);
  };

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onVote={handleVote}
      />
    );
  }

  return (
    <>
      <PageHero
        kicker="Comunidade"
        title={<>Fórum <span className="text-blue-450">First Step</span></>}
        subtitle="Tire dúvidas, compartilhe experiências e troque ideias com quem também está dando os primeiros passos."
      />

      <section className="section page-section">
        <div className="container forum-layout">
          <div className="forum-main">
            <div className="forum-toolbar">
              <div className="forum-categories">
                <button
                  className={activeCategory === 'Todas' ? 'cat-pill active' : 'cat-pill'}
                  onClick={() => setActiveCategory('Todas')}
                >
                  Todas
                </button>
                {FORUM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={activeCategory === cat ? 'cat-pill active' : 'cat-pill'}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button className="button button-small button-blue" onClick={() => setShowNewForm(!showNewForm)}>
                <Plus size={15} /> Nova publicação
              </button>
            </div>

            {showNewForm && (
              <div className="new-post-form">
                <h3>Criar publicação</h3>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="form-select">
                  {FORUM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  className="form-input"
                  placeholder="Título da sua pergunta"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                  className="form-textarea"
                  placeholder="Descreva sua dúvida ou experiência..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                />
                <input
                  className="form-input"
                  placeholder="Seu nome (opcional)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                />
                <div className="form-actions">
                  <button className="button button-ghost button-small" onClick={() => setShowNewForm(false)}>Cancelar</button>
                  <button className="button button-blue button-small" onClick={handleSubmitPost} disabled={submitting || !newTitle.trim()}>
                    <Send size={14} /> {submitting ? 'Enviando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <p className="empty-state">Carregando publicações...</p>
            ) : posts.length === 0 ? (
              <p className="empty-state">Nenhuma publicação nesta categoria ainda. Seja o primeiro!</p>
            ) : (
              <div className="post-list">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="post-card"
                    onClick={() => setSelectedPost(post)}
                  >
                    <button
                      className="vote-btn"
                      onClick={(e) => { e.stopPropagation(); handleVote(post); }}
                      aria-label="Votar"
                    >
                      <ArrowUp size={16} />
                      <span>{post.votes}</span>
                    </button>
                    <div className="post-body">
                      <span className="post-category">{post.category}</span>
                      <h3>{post.title}</h3>
                      {post.content && <p>{post.content}</p>}
                      <div className="post-meta">
                        <span><MessageCircle size={13} /> {post.author_name}</span>
                        <span>{timeAgo(post.created_at)}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="post-chevron" />
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="forum-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <Flame size={17} className="text-blue-450" />
                <h3>Discussões em alta</h3>
              </div>
              {trending.length === 0 ? (
                <p className="empty-state">Nada em alta ainda.</p>
              ) : (
                trending.map((post, i) => (
                  <button
                    key={post.id}
                    className="trending-item"
                    onClick={() => setSelectedPost(post)}
                  >
                    <span className="trending-rank">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <span className="trending-cat">{post.category}</span>
                      <p>{post.title}</p>
                      <span className="trending-votes"><TrendingUp size={12} /> {post.votes} votos</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function PostDetail({
  post,
  onBack,
  onVote,
}: {
  post: ForumPost;
  onBack: () => void;
  onVote: (post: ForumPost) => void;
}) {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      if (data) setComments(data as ForumComment[]);
      setLoadingComments(false);
    };
    fetchComments();
  }, [post.id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('forum_comments')
      .insert({
        post_id: post.id,
        content: commentText.trim(),
        author_name: commentAuthor.trim() || 'Anônimo',
      })
      .select()
      .single();
    if (data) {
      setComments((prev) => [...prev, data as ForumComment]);
      setCommentText('');
      setCommentAuthor('');
    }
    setSubmitting(false);
  };

  return (
    <section className="section page-section">
      <div className="container narrow-container">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={16} /> Voltar ao fórum
        </button>

        <article className="post-detail">
          <span className="post-category">{post.category}</span>
          <h2>{post.title}</h2>
          <div className="post-detail-meta">
            <span><MessageCircle size={14} /> {post.author_name}</span>
            <span>{timeAgo(post.created_at)}</span>
          </div>
          {post.content && <p className="post-detail-content">{post.content}</p>}
          <button className="vote-btn vote-btn-large" onClick={() => onVote(post)}>
            <ArrowUp size={18} /> {post.votes} votos
          </button>
        </article>

        <div className="comments-section">
          <h3>Comentários ({comments.length})</h3>

          <div className="comment-form">
            <input
              className="form-input"
              placeholder="Seu nome (opcional)"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
            />
            <textarea
              className="form-textarea"
              placeholder="Escreva seu comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <button
              className="button button-blue button-small"
              onClick={handleAddComment}
              disabled={submitting || !commentText.trim()}
            >
              <Send size={14} /> {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>

          {loadingComments ? (
            <p className="empty-state">Carregando comentários...</p>
          ) : comments.length === 0 ? (
            <p className="empty-state">Nenhum comentário ainda. Seja o primeiro a responder!</p>
          ) : (
            <div className="comment-list">
              {comments.map((c) => (
                <div key={c.id} className="comment-card">
                  <div className="comment-avatar">{c.author_name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="comment-header">
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
      </div>
    </section>
  );
}
