import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, FileText, Globe, Layers, Newspaper, PlayCircle, Search } from 'lucide-react';
import { supabase, CONTENT_CATEGORIES, type ContentItem } from '@/lib/supabase';
import { PageHero, formatDate } from '@/components/Layout';

const TYPE_META: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  article: { icon: Newspaper, label: 'Artigo', color: '#3b82f6' },
  video: { icon: PlayCircle, label: 'Vídeo', color: '#0891b2' },
  site: { icon: Globe, label: 'Site', color: '#059669' },
  material: { icon: FileText, label: 'Material', color: '#d97706' },
};

export function ContentCenterPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('content_items').select('*').order('created_at', { ascending: false });
      if (!error && data) setItems(data as ContentItem[]);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['Todos', ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== 'Todos' && item.category !== activeCategory) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, activeCategory, search]);

  return (
    <>
      <PageHero
        kicker="Central de Conteúdos"
        title={<>Tudo em um <span className="text-blue-450">só lugar.</span></>}
        subtitle="Artigos, vídeos, sites, links externos e materiais educacionais organizados por categoria para acelerar sua jornada."
      />

      <section className="section page-section">
        <div className="container">
          <div className="content-toolbar">
            <div className="content-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={activeCategory === cat ? 'cat-pill active' : 'cat-pill'}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="search-box content-search">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar conteúdo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p className="empty-state">Carregando conteúdos...</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state-card">
              <Layers size={36} />
              <h3>Nenhum conteúdo encontrado</h3>
              <p>Tente ajustar a busca ou selecionar outra categoria.</p>
            </div>
          ) : (
            <div className="content-grid">
              {filtered.map((item) => {
                const meta = TYPE_META[item.item_type] || TYPE_META.article;
                const Icon = meta.icon;
                return (
                  <article key={item.id} className="content-card">
                    <div className="content-card-top">
                      <div className="content-card-icon" style={{ color: meta.color, borderColor: `${meta.color}30`, background: `${meta.color}12` }}>
                        <Icon size={18} />
                      </div>
                      <span className="content-type-tag" style={{ color: meta.color }}>{meta.label}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="content-card-footer">
                      <div className="content-card-meta">
                        <span>{item.source}</span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="content-card-link">
                          Acessar <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
