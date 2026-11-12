import { useState } from 'react';
import { BriefcaseBusiness, ExternalLink, GraduationCap } from 'lucide-react';
import { PageHero } from '@/components/Layout';

type Company = { name: string; url: string; logo: string };

const SENAC_URL = 'https://www.sp.senac.br';

const COMPANIES: Record<'aprendiz' | 'estagio' | 'clt', Company[]> = {
  aprendiz: [
    { name: "McDonald's", url: 'https://br.mcdonalds.com/trabalhe-conosco.html', logo: 'https://logo.clearbit.com/mcdonalds.com' },
    { name: 'Carrefour', url: 'https://www.carrefour.com.br/carreira', logo: 'https://logo.clearbit.com/carrefour.com' },
    { name: 'Assaí Atacadista', url: 'https://www.assai.com.br/trabalhe-conosco', logo: 'https://logo.clearbit.com/assai.com.br' },
    { name: 'Magazine Luiza', url: 'https://soumagalu.com.br/', logo: 'https://logo.clearbit.com/magazineluiza.com.br' },
    { name: 'Correios', url: 'https://www.correios.com.br/trabalhe-conosco', logo: 'https://logo.clearbit.com/correios.com.br' },
    { name: 'Banco do Brasil', url: 'https://www.bb.com.br/site/sobre-a-bb/carreira/', logo: 'https://logo.clearbit.com/bb.com.br' },
    { name: 'Bradesco', url: 'https://www.bradesco.com.br/carreira', logo: 'https://logo.clearbit.com/bradesco.com.br' },
    { name: 'Itaú Unibanco', url: 'https://www.itau.com.br/carreira', logo: 'https://logo.clearbit.com/itau.com.br' },
    { name: 'Renner', url: 'https://www.lojasrennersa.com.br/carreira/', logo: 'https://logo.clearbit.com/lojasrenner.com.br' },
    { name: 'DHL', url: 'https://www.dhl.com/br-pt/home/carreira.html', logo: 'https://logo.clearbit.com/dhl.com' },
  ],
  estagio: [
    { name: 'Ambev', url: 'https://www.ambev.com.br/carreira/', logo: 'https://logo.clearbit.com/ambev.com.br' },
    { name: 'Itaú Unibanco', url: 'https://www.itau.com.br/carreira', logo: 'https://logo.clearbit.com/itau.com.br' },
    { name: 'Santander', url: 'https://www.santander.com.br/carreira', logo: 'https://logo.clearbit.com/santander.com.br' },
    { name: 'Nestlé', url: 'https://www.nestle.com.br/carreira', logo: 'https://logo.clearbit.com/nestle.com' },
    { name: 'Coca-Cola FEMSA', url: 'https://www.cocacola.com.br/carreira', logo: 'https://logo.clearbit.com/cocacola.com.br' },
    { name: 'Petrobras', url: 'https://www.petronect.com.br/', logo: 'https://logo.clearbit.com/petrobras.com.br' },
    { name: 'Embraer', url: 'https://embraer.com/br/pt/carreira', logo: 'https://logo.clearbit.com/embraer.com' },
    { name: 'Natura', url: 'https://www.natura.com.br/carreira', logo: 'https://logo.clearbit.com/natura.com.br' },
    { name: 'Deloitte', url: 'https://www.deloitte.com/br/carreira', logo: 'https://logo.clearbit.com/deloitte.com' },
    { name: 'Google', url: 'https://www.google.com/about/careers/applications/locations/brazil', logo: 'https://logo.clearbit.com/google.com' },
  ],
  clt: [
    { name: 'Amazon', url: 'https://www.amazon.jobs/', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/carreira', logo: 'https://logo.clearbit.com/mercadolivre.com' },
    { name: 'Nubank', url: 'https://nubank.com.br/carreira/', logo: 'https://logo.clearbit.com/nubank.com.br' },
    { name: 'Claro', url: 'https://www.claro.com.br/carreira', logo: 'https://logo.clearbit.com/claro.com.br' },
    { name: 'Vivo', url: 'https://www.vivo.com.br/carreira', logo: 'https://logo.clearbit.com/vivo.com.br' },
    { name: 'Gerdau', url: 'https://www.gerdau.com/br/carreira', logo: 'https://logo.clearbit.com/gerdau.com' },
    { name: 'Grupo Boticário', url: 'https://www.grupoboticario.com.br/carreira/', logo: 'https://logo.clearbit.com/grupoboticario.com.br' },
    { name: 'Pão de Açúcar', url: 'https://www.gpabr.com/carreira/', logo: 'https://logo.clearbit.com/paodeacucar.com' },
    { name: 'Localiza', url: 'https://www.localiza.com/br/pt-br/carreira', logo: 'https://logo.clearbit.com/localiza.com' },
    { name: 'Volkswagen', url: 'https://www.vw.com.br/carreira.html', logo: 'https://logo.clearbit.com/volkswagen.com' },
  ],
};

const TABS = [
  { id: 'aprendiz' as const, label: 'Jovem Aprendiz', desc: 'Programas de aprendizagem para jovens de 14 a 24 anos. Primeira porta de entrada para o mercado de trabalho.' },
  { id: 'estagio' as const, label: 'Estágio', desc: 'Vagas de estágio em grandes empresas. Oportunidades para quem está cursando ensino superior ou técnico.' },
  { id: 'clt' as const, label: 'CLT', desc: 'Vagas efetivas com carteira assinada. Oportunidades em empresas de diversos portes e setores.' },
];

export function JobsPage() {
  const [activeTab, setActiveTab] = useState<'aprendiz' | 'estagio' | 'clt'>('aprendiz');
  const companies = COMPANIES[activeTab];
  const tabInfo = TABS.find((t) => t.id === activeTab)!;

  return (
    <>
      <PageHero
        kicker="Central de vagas"
        title={<>Encontre sua <span className="text-blue-450">próxima oportunidade.</span></>}
        subtitle="Empresas parceiras com oportunidades reais para jovem aprendiz, estágio e CLT. Clique na empresa para acessar a página de carreiras."
      />

      <section className="section page-section">
        <div className="container">
          <a href={SENAC_URL} target="_blank" rel="noopener noreferrer" className="senac-featured-banner">
            <div className="senac-featured-logo">
              <GraduationCap size={44} />
            </div>
            <div className="senac-featured-text">
              <span className="section-kicker">Parceria First Step</span>
              <h2>SENAC</h2>
              <p>Cursos gratuitos e profissionalizantes em todo o estado de São Paulo. Acesse o site do SENAC para conhecer os programas disponíveis.</p>
            </div>
            <div className="senac-featured-cta">
              Acessar site <ExternalLink size={18} />
            </div>
          </a>

          <div className="jobs-category-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="jobs-category-header">
            <div>
              <span className="section-kicker">{tabInfo.label}</span>
              <h2>Empresas contratando</h2>
              <p>{tabInfo.desc}</p>
            </div>
            <span className="jobs-count">{companies.length} empresas</span>
          </div>

          <div className="jobs-companies-grid">
            {companies.map((company) => (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="job-company-card"
              >
                <div className="job-company-logo">
                  <img
                    src={company.logo}
                    alt={company.name}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      img.parentElement?.classList.add('logo-fallback');
                    }}
                  />
                  <div className="job-company-logo-fallback">
                    <BriefcaseBusiness size={24} />
                  </div>
                </div>
                <div className="job-company-info">
                  <h3>{company.name}</h3>
                  <p>Ver vagas disponíveis</p>
                </div>
                <ExternalLink size={16} className="job-company-cta" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
