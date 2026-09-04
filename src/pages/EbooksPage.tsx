import { useEffect, useState } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { supabase, type Ebook } from '@/lib/supabase';
import { PageHero } from '@/components/Layout';

export function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      const { data, error } = await supabase.from('ebooks').select('*').order('sort_order');
      if (!error && data) setEbooks(data as Ebook[]);
      setLoading(false);
    };
    fetchEbooks();
  }, []);

  return (
    <>
      <PageHero
        kicker="Biblioteca First Step"
        title={<>E-books <span className="text-blue-450">First Step.</span></>}
        subtitle="Materiais gratuitos produzidos pela nossa equipe para acelerar sua jornada profissional. Baixe, leia e compartilhe."
      />

      <section className="section page-section">
        <div className="container">
          {loading ? (
            <p className="empty-state">Carregando e-books...</p>
          ) : ebooks.length === 0 ? (
            <div className="empty-state-card">
              <BookOpen size={36} />
              <h3>Nenhum e-book disponível</h3>
              <p>Os e-books aparecerão aqui em breve.</p>
            </div>
          ) : (
            <div className="ebooks-grid">
              {ebooks.map((ebook) => (
                <article key={ebook.id} className="ebook-card">
                  <div className="ebook-cover-wrap">
                    {ebook.cover_url ? (
                      <img src={ebook.cover_url} alt={ebook.title} className="ebook-cover" />
                    ) : (
                      <div className="ebook-cover-placeholder">
                        <BookOpen size={40} />
                      </div>
                    )}
                  </div>
                  <div className="ebook-info">
                    <h3>{ebook.title}</h3>
                    <p>{ebook.description}</p>
                    <a
                      href={ebook.file_url || '#'}
                      target={ebook.file_url ? '_blank' : undefined}
                      rel={ebook.file_url ? 'noopener noreferrer' : undefined}
                      className="button button-blue button-small ebook-download-btn"
                    >
                      <Download size={15} /> Baixar PDF
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="integration-notice">
            <div className="integration-icon"><BookOpen size={20} /></div>
            <div>
              <strong>Sobre os e-books</strong>
              <p>Os e-books são materiais exclusivos produzidos pela equipe First Step. As capas e arquivos PDF serão adicionados posteriormente — os espaços já estão preparados.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
