import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, ExternalLink, Filter, MapPin, Search, X } from 'lucide-react';
import { supabase, JOB_TYPES, JOB_MODALITIES, type Job } from '@/lib/supabase';
import { PageHero } from '@/components/Layout';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('Todas');
  const [filterLocation, setFilterLocation] = useState('Todas');
  const [filterModality, setFilterModality] = useState('Todas');
  const [filterType, setFilterType] = useState('Todas');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setJobs(data as Job[]);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const areas = useMemo(() => {
    const set = new Set(jobs.map((j) => j.area));
    return ['Todas', ...Array.from(set).sort()];
  }, [jobs]);

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location));
    return ['Todas', ...Array.from(set).sort()];
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterArea !== 'Todas' && j.area !== filterArea) return false;
      if (filterLocation !== 'Todas' && j.location !== filterLocation) return false;
      if (filterModality !== 'Todas' && j.modality !== filterModality) return false;
      if (filterType !== 'Todas' && j.job_type !== filterType) return false;
      return true;
    });
  }, [jobs, search, filterArea, filterLocation, filterModality, filterType]);

  const activeFilterCount = [filterArea, filterLocation, filterModality, filterType].filter((f) => f !== 'Todas').length;

  const clearFilters = () => {
    setFilterArea('Todas');
    setFilterLocation('Todas');
    setFilterModality('Todas');
    setFilterType('Todas');
    setSearch('');
  };

  return (
    <>
      <PageHero
        kicker="Central de vagas"
        title={<>Encontre sua <span className="text-blue-450">próxima vaga.</span></>}
        subtitle="Vagas de emprego, estágio e primeiro emprego reunidas em um só lugar. Filtre por área, localização, modalidade e tipo."
      />

      <section className="section page-section">
        <div className="container">
          <div className="jobs-layout">
            <button
              className={`filter-toggle ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter size={16} /> Filtros {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
              {activeFilterCount > 0 && <span className="filter-clear" onClick={(e) => { e.stopPropagation(); clearFilters(); }}><X size={14} /></span>}
            </button>

            <div className="search-box">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por cargo ou empresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={`jobs-filters ${filtersOpen ? 'is-open' : ''}`}>
            <div className="filter-group">
              <label>Área</label>
              <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} className="form-select">
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Localização</label>
              <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="form-select">
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Modalidade</label>
              <select value={filterModality} onChange={(e) => setFilterModality(e.target.value)} className="form-select">
                <option value="Todas">Todas</option>
                {JOB_MODALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Tipo de vaga</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-select">
                <option value="Todas">Todas</option>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="jobs-results-bar">
            <span>{filtered.length} {filtered.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}</span>
            {activeFilterCount > 0 && <button className="text-link" onClick={clearFilters}>Limpar filtros</button>}
          </div>

          {loading ? (
            <p className="empty-state">Carregando vagas...</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state-card">
              <BriefcaseBusiness size={36} />
              <h3>Nenhuma vaga encontrada</h3>
              <p>Tente ajustar os filtros ou buscar por outros termos.</p>
              <button className="button button-ghost button-small" onClick={clearFilters}>Limpar filtros</button>
            </div>
          ) : (
            <div className="jobs-grid">
              {filtered.map((job) => (
                <article key={job.id} className="job-card">
                  <div className="job-card-header">
                    <div className="opportunity-logo"><BriefcaseBusiness size={19} /></div>
                    <span className="job-type-tag">{job.job_type}</span>
                  </div>
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  {job.description && <p className="job-desc">{job.description}</p>}
                  <div className="job-tags">
                    <span className="job-tag">{job.area}</span>
                    <span className="job-tag"><MapPin size={12} /> {job.location}</span>
                    <span className="job-tag">{job.modality}</span>
                  </div>
                  <div className="job-card-footer">
                    <span className="job-source">via {job.source}</span>
                    {job.external_url ? (
                      <a href={job.external_url} target="_blank" rel="noopener noreferrer" className="button button-blue button-small">
                        Candidatar <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button className="button button-ghost button-small">Ver detalhes <ArrowRight size={14} /></button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="integration-notice">
            <div className="integration-icon"><BriefcaseBusiness size={20} /></div>
            <div>
              <strong>Integração com plataformas externas</strong>
              <p>Esta central de vagas está preparada para integração futura com plataformas de recrutamento como Gupy, LinkedIn e Vagas.com. Novas vagas serão sincronizadas automaticamente.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
