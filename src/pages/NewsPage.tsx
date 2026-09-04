import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, ExternalLink, Flame, Newspaper } from 'lucide-react';
import { supabase, NEWS_CATEGORIES, type NewsArticle } from '@/lib/supabase';
import { PageHero, formatDate } from '@/components/Layout';

export function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featured, setFeatured] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data: featData } = await supabase
        .from('news')
        .select('*')
        .eq('is_featured', true)
        .order('published_at', { ascending: false });
      if (featData) setFeatured(featData as NewsArticle[]);

      let query = supabase.from('news').select('*').order('published_at', { ascending: false });
      if (activeCategory !== 'Todas') query = query.eq('category', activeCategory);
      const { data, error } = await query;
      if (!error && data) setArticles(data as NewsArticle[]);
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  if (selectedArticle) {
    return (
      <section className="section page-section">
        <div className="container narrow-container">
          <button className="back-btn" onClick={() => setSelectedArticle(null)}>
            <ArrowRight size={16} className="rotate-180" /> Voltar para notícias
          </button>

          <article className="article-detail">
            <span className="post-category">{selectedArticle.category}</span>
            <h2>{selectedArticle.title}</h2>
            <div className="article-detail-meta">
              <span><Flame size={14} /> {selectedArticle.source}</span>
              <span><Calendar size={14} /> {formatDate(selectedArticle.published_at)}</span>
            </div>
            {selectedArticle.summary && <p className="article-detail-summary">{selectedArticle.summary}</p>}
            {selectedArticle.content && <div className="article-detail-content">{selectedArticle.content}</div>}
            {selectedArticle.source_url && (
              <a href={selectedArticle.source_url} target="_blank" rel="noopener noreferrer" className="button button-ghost button-small">
                Ver fonte original <ExternalLink size={14} />
              </a>
            )}
          </article>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker="Notícias"
        title={<>Fique por dentro do <span className="text-blue-450">mercado.</span></>}
        subtitle="Notícias sobre mercado de trabalho, cursos, estágios, processos seletivos e oportunidades — com fonte e data."
      />

      <section className="section page-section">
        <div className="container">
          {featured.length > 0 && activeCategory === 'Todas' && (
            <div className="news-featured-section">
              <div className="sidebar-header">
                <Flame size={17} className="text-blue-450" />
                <h3>Notícias em destaque</h3>
              </div>
              <div className="news-featured-grid">
                {featured.map((article) => (
                  <article key={article.id} className="news-featured-card" onClick={() => setSelectedArticle(article)}>
                    <div className="news-featured-accent" />
                    <span className="post-category">{article.category}</span>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <div className="news-meta">
                      <span><Flame size={12} /> {article.source}</span>
                      <span><Calendar size={12} /> {formatDate(article.published_at)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="forum-toolbar" style={{ marginBottom: '32px' }}>
            <div className="forum-categories">
              <button
                className={activeCategory === 'Todas' ? 'cat-pill active' : 'cat-pill'}
                onClick={() => setActiveCategory('Todas')}
              >
                Todas
              </button>
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={activeCategory === cat ? 'cat-pill active' : 'cat-pill'}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="empty-state">Carregando notícias...</p>
          ) : articles.length === 0 ? (
            <div className="empty-state-card">
              <Newspaper size={36} />
              <h3>Nenhuma notícia encontrada</h3>
              <p>Não há notícias nesta categoria no momento.</p>
            </div>
          ) : (
            <div className="news-list">
              {articles.map((article) => (
                <article key={article.id} className="news-row" onClick={() => setSelectedArticle(article)}>
                  <div className="news-row-icon"><Newspaper size={18} /></div>
                  <div className="news-row-main">
                    <div className="news-row-top">
                      <span className="post-category">{article.category}</span>
                      {article.is_featured && <span className="featured-badge">Destaque</span>}
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <div className="news-meta">
                      <span><Flame size={12} /> {article.source}</span>
                      <span><Calendar size={12} /> {formatDate(article.published_at)}</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="news-row-arrow" />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
