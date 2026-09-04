import { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, GraduationCap, BriefcaseBusiness, Compass } from 'lucide-react';
import { supabase, SENAC_CATEGORIES, type SenacOpportunity } from '@/lib/supabase';
import { PageHero } from '@/components/Layout';

const CATEGORY_ICONS: Record<string, typeof GraduationCap> = {
  'Curso': GraduationCap,
  'Estágio': BriefcaseBusiness,
  'Carreira': Compass,
};

export function SenacPage() {
  const [opportunities, setOpportunities] = useState<SenacOpportunity[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      let query = supabase.from('senac_opportunities').select('*').order('created_at', { ascending: false });
      if (activeCategory !== 'Todas') query = query.eq('category', activeCategory);
      const { data, error } = await query;
      if (!error && data) setOpportunities(data as SenacOpportunity[]);
      setLoading(false);
    };
    fetchOpportunities();
  }, [activeCategory]);

  const stats = [
    { icon: GraduationCap, label: 'Cursos gratuitos', value: '200+' },
    { icon: BriefcaseBusiness, label: 'Vagas de estágio', value: '50+' },
    { icon: Compass, label: 'Orientação de carreira', value: 'Individual' },
  ];

  return (
    <>
      <PageHero
        kicker="Oportunidades SENAC"
        title={<>Oportunidades <span className="text-blue-450">SENAC.</span></>}
        subtitle="Acesse oportunidades oficiais de estágio, cursos e carreira do SENAC em um só lugar."
      />

      <section className="section page-section">
        <div className="container">
          <div className="senac-stats">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="senac-stat-card">
                <div className="card-icon"><Icon size={19} /></div>
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="senac-banner">
            <div className="senac-banner-icon"><GraduationCap size={28} /></div>
            <div>
              <h3>Parceria com o SENAC</h3>
              <p>Direcionamos você para as oportunidades oficiais de estágio, cursos gratuitos e orientação de carreira do SENAC. Em breve, integração direta com a plataforma oficial.</p>
            </div>
          </div>

          <div className="forum-toolbar" style={{ marginBottom: '32px' }}>
            <div className="forum-categories">
              <button
                className={activeCategory === 'Todas' ? 'cat-pill active' : 'cat-pill'}
                onClick={() => setActiveCategory('Todas')}
              >
                Todas
              </button>
              {SENAC_CATEGORIES.map((cat) => (
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
            <p className="empty-state">Carregando oportunidades...</p>
          ) : opportunities.length === 0 ? (
            <div className="empty-state-card">
              <GraduationCap size={36} />
              <h3>Nenhuma oportunidade encontrada</h3>
              <p>Não há oportunidades nesta categoria no momento.</p>
            </div>
          ) : (
            <div className="senac-grid">
              {opportunities.map((opp) => {
                const Icon = CATEGORY_ICONS[opp.category] || GraduationCap;
                return (
                  <article key={opp.id} className="senac-card">
                    <div className="senac-card-header">
                      <div className="card-icon"><Icon size={19} /></div>
                      <span className="post-category">{opp.category}</span>
                    </div>
                    <h3>{opp.title}</h3>
                    {opp.description && <p>{opp.description}</p>}
                    {opp.external_url ? (
                      <a href={opp.external_url} target="_blank" rel="noopener noreferrer" className="button button-blue button-small senac-card-btn">
                        Acessar oportunidade <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button className="button button-ghost button-small senac-card-btn">
                        Saiba mais <ArrowRight size={14} />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          <div className="integration-notice">
            <div className="integration-icon"><GraduationCap size={20} /></div>
            <div>
              <strong>Integração futura com o SENAC</strong>
              <p>Esta área está preparada para integração direta com a plataforma oficial do SENAC. As oportunidades serão sincronizadas automaticamente, trazendo cursos, estágios e programas de carreira atualizados em tempo real.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
