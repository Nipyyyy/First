import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  House,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Navbar, Footer, type PageId } from '@/components/Layout';
import { FeedPage } from '@/pages/FeedPage';
import { ForumPage } from '@/pages/ForumPage';
import { JobsPage } from '@/pages/JobsPage';
import { NewsPage } from '@/pages/NewsPage';
import { SenacPage } from '@/pages/SenacPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EbooksPage } from '@/pages/EbooksPage';
import { AIPage } from '@/pages/AIPage';
import { ContentCenterPage } from '@/pages/ContentCenterPage';
import { CoursesPage } from '@/pages/CoursesPage';

const journeyCards = [
  {
    icon: Target,
    number: '01',
    title: 'Entenda seu caminho',
    text: 'Conte com clareza para descobrir possibilidades que combinam com você.',
  },
  {
    icon: TrendingUp,
    number: '02',
    title: 'Desenvolva seu potencial',
    text: 'Aprenda habilidades que fazem diferença nos estudos e no trabalho.',
  },
  {
    icon: BriefcaseBusiness,
    number: '03',
    title: 'Chegue mais preparado',
    text: 'Encontre oportunidades e dê os próximos passos com confiança.',
  },
];

const opportunities = [
  { tag: 'Primeiro emprego', title: 'Assistente de atendimento', company: 'Núcleo Digital', location: 'São Paulo, SP', type: 'Híbrido' },
  { tag: 'Estágio', title: 'Estágio em marketing', company: 'Ativa Lab', location: 'Remoto', type: 'Flexível' },
  { tag: 'Aprendiz', title: 'Jovem aprendiz administrativo', company: 'Horizonte & Co.', location: 'Rio de Janeiro, RJ', type: 'Presencial' },
];

function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-grid" />
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="container hero-content">
          <div className="eyebrow"><span className="eyebrow-dot" /> Um novo começo, do seu jeito</div>
          <h1>Seu primeiro passo<br /><em>começa aqui.</em></h1>
          <p className="hero-copy">Do Ensino Médio ao mercado de trabalho, encontre oportunidades, desenvolva habilidades e prepare-se para a próxima etapa da sua carreira.</p>
          <div className="hero-buttons">
            <button className="button button-blue" onClick={() => onNavigate('jobs')}>Começar agora <ArrowRight size={17} /></button>
            <button className="button button-ghost" onClick={() => onNavigate('forum')}><Play size={15} fill="currentColor" /> Explorar comunidade</button>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true"><span>LM</span><span>AS</span><span>JC</span><span>+</span></div>
            <div><strong>+12 mil jovens</strong><span>já deram o primeiro passo</span></div>
          </div>
        </div>
        <div className="hero-bottom container">
          <div className="scroll-cue"><span className="scroll-line" /> Role para explorar</div>
          <span className="hero-index">01 <i /> 04</span>
        </div>
      </section>

      <section className="section journey-section" id="jornada">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="section-kicker">A sua jornada</span><h2>Clareza para seguir.<br /><span>Confiança para chegar.</span></h2></div>
            <p>Você não precisa descobrir tudo sozinho. A First Step reúne as ferramentas certas para transformar possibilidades em próximos passos.</p>
          </div>
          <div className="journey-grid">
            {journeyCards.map(({ icon: Icon, number, title, text }) => (
              <article className="journey-card" key={number}>
                <div className="card-top"><span className="card-icon"><Icon size={19} /></span><span className="card-number">{number}</span></div>
                <h3>{title}</h3><p>{text}</p><button onClick={() => onNavigate('jobs')} aria-label={`Saiba mais sobre ${title}`}><ChevronRight size={18} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section opportunity-section" id="oportunidades">
        <div className="container">
          <div className="section-heading opportunity-heading">
            <div><span className="section-kicker">Oportunidades reais</span><h2>O próximo passo<br /><span>está mais perto.</span></h2></div>
            <button className="underlined-link" onClick={() => onNavigate('jobs')}>Ver todas as oportunidades <ArrowRight size={15} /></button>
          </div>
          <div className="opportunity-list">
            {opportunities.map((item) => (
              <article className="opportunity-row" key={item.title} onClick={() => onNavigate('jobs')}>
                <div className="opportunity-logo"><BriefcaseBusiness size={19} /></div>
                <div className="opportunity-main"><span className="opportunity-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.company}</p></div>
                <div className="opportunity-meta"><span>{item.location}</span><span>{item.type}</span></div>
                <button className="row-arrow" aria-label={`Ver ${item.title}`}><ArrowRight size={17} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section community-section" id="comunidade">
        <div className="container community-card">
          <div className="community-copy">
            <span className="section-kicker">Você faz parte disso</span>
            <h2>Aprender é melhor<br /><span>quando se está junto.</span></h2>
            <p>Troque experiências, tire dúvidas e encontre inspiração em uma comunidade que está construindo o seu próprio futuro.</p>
            <button className="button button-light" onClick={() => onNavigate('forum')}>Conhecer o fórum <ArrowRight size={16} /></button>
          </div>
          <div className="community-art">
            <div className="art-circle art-circle-large" />
            <div className="art-circle art-circle-small" />
            <div className="quote-card"><MessageCircle size={17} /><p>"Você é capaz de ir muito mais longe."</p><span>— Ana, comunidade First Step</span></div>
            <div className="art-stat"><strong>93%</strong><span>se sentem mais preparados</span></div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner">
          <div><span className="section-kicker">Seu momento é agora</span><h2>Todo grande caminho<br />começa com um passo.</h2></div>
          <button className="button button-blue" onClick={() => onNavigate('forum')}>Começar minha jornada <ArrowRight size={17} /></button>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [page, setPage] = useState<PageId>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="site-shell">
      <Navbar current={page} onNavigate={setPage} />
      {page === 'home' && <HomePage onNavigate={setPage} />}
      {page === 'feed' && <FeedPage />}
      {page === 'forum' && <ForumPage />}
      {page === 'jobs' && <JobsPage />}
      {page === 'news' && <NewsPage />}
      {page === 'senac' && <SenacPage />}
      {page === 'profile' && <ProfilePage />}
      {page === 'ebooks' && <EbooksPage />}
      {page === 'ai' && <AIPage />}
      {page === 'content' && <ContentCenterPage />}
      {page === 'courses' && <CoursesPage />}
      <Footer onNavigate={setPage} />
    </div>
  );
}

export default App;
