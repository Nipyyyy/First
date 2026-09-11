import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Bot,
  BookOpen,
  ChevronRight,
  MapPin,
  MessageCircle,
  Play,
  PlayCircle,
  Target,
  TrendingUp,
  Newspaper,
} from 'lucide-react';
import { Sidebar, Footer, type PageId } from '@/components/Layout';
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
  { icon: Target, number: '01', title: 'Entenda seu caminho', text: 'Conte com clareza para descobrir possibilidades que combinam com você.' },
  { icon: TrendingUp, number: '02', title: 'Desenvolva seu potencial', text: 'Aprenda habilidades que fazem diferença nos estudos e no trabalho.' },
  { icon: BriefcaseBusiness, number: '03', title: 'Chegue mais preparado', text: 'Encontre oportunidades e dê os próximos passos com confiança.' },
];

const highlightCards = [
  { icon: BriefcaseBusiness, title: 'Vagas', text: 'Oportunidades reais de primeiro emprego, estágio e aprendiz.', page: 'jobs' as PageId },
  { icon: Newspaper, title: 'Notícias', text: 'Fique por dentro do mercado com notícias atualizadas.', page: 'news' as PageId },
  { icon: PlayCircle, title: 'Cursos', text: 'Cursos gratuitos para desenvolver suas habilidades.', page: 'courses' as PageId },
  { icon: Bot, title: 'First Step IA', text: 'Sua assistente de carreira com inteligência artificial.', page: 'ai' as PageId },
];

const homeNews = [
  { category: 'Mercado', title: 'Mercado de trabalho cresce para jovens', summary: 'Novos dados mostram aumento de vagas para primeiro emprego.', img: 'https://images.pexels.com/photos/4651145/pexels-photo-4651145.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', source: 'First Step', date: '08 Set 2026' },
  { category: 'Estágios', title: 'Programas de estágio abrem inscrições', summary: 'Grandes empresas abrem vagas para estudantes de todo o país.', img: 'https://images.pexels.com/photos/4225927/pexels-photo-4225927.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', source: 'First Step', date: '07 Set 2026' },
  { category: 'Cursos', title: 'Cursos gratuitos online ganham destaque', summary: 'Plataformas oferecem certificados reconhecidos pelo mercado.', img: 'https://images.pexels.com/photos/5530520/pexels-photo-5530520.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', source: 'First Step', date: '06 Set 2026' },
];

const homeJobs = [
  { type: 'Estágio', title: 'Estágio em Marketing Digital', company: 'Ativa Lab', area: 'Marketing', location: 'Remoto', modality: 'Remoto' },
  { type: 'Primeiro emprego', title: 'Assistente de Atendimento', company: 'Núcleo Digital', area: 'Atendimento', location: 'São Paulo, SP', modality: 'Híbrido' },
  { type: 'Aprendiz', title: 'Jovem Aprendiz Administrativo', company: 'Horizonte & Co.', area: 'Administrativo', location: 'Rio de Janeiro, RJ', modality: 'Presencial' },
];

const aiImage = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';

const ebookCarouselItems = [
  { title: 'Currículo sem experiência', desc: 'Guia prático' },
  { title: 'Entrevistas de estágio', desc: 'Tudo o que você precisa' },
  { title: 'Primeiro emprego', desc: 'Passo a passo completo' },
  { title: 'Habilidades do futuro', desc: 'Soft skills essenciais' },
  { title: 'Organização e produtividade', desc: 'Métodos e ferramentas' },
  { title: 'Carreira desde cedo', desc: 'Construindo seu caminho' },
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
          <span className="hero-index">01 <i /> 05</span>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0, paddingTop: '100px' }}>
        <div className="container">
          <div className="home-highlights">
            {highlightCards.map(({ icon: Icon, title, text, page }) => (
              <article key={title} className="highlight-card" onClick={() => onNavigate(page)}>
                <div className="highlight-icon"><Icon size={22} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="highlight-arrow">Explorar <ArrowRight size={14} /></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="jornada" style={{ paddingTop: '80px' }}>
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

      <section className="section" style={{ paddingTop: '80px' }}>
        <div className="container">
          <div className="opportunity-heading section-heading" style={{ marginBottom: '32px' }}>
            <div><span className="section-kicker">Notícias em destaque</span><h2>O que está<br /><span>acontecendo agora.</span></h2></div>
            <button className="underlined-link" onClick={() => onNavigate('news')}>Ver todas as notícias <ArrowRight size={15} /></button>
          </div>
          <div className="home-news-preview">
            {homeNews.map((item) => (
              <article key={item.title} className="home-news-card" onClick={() => onNavigate('news')}>
                <div className="home-news-card-img"><img src={item.img} alt={item.title} loading="lazy" /></div>
                <div className="home-news-card-body">
                  <span className="post-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="home-news-card-meta"><span>{item.source}</span><span>{item.date}</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section opportunity-section" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="opportunity-heading section-heading" style={{ marginBottom: '32px' }}>
            <div><span className="section-kicker">Oportunidades reais</span><h2>O próximo passo<br /><span>está mais perto.</span></h2></div>
            <button className="underlined-link" onClick={() => onNavigate('jobs')}>Ver todas as oportunidades <ArrowRight size={15} /></button>
          </div>
          <div className="home-jobs-preview">
            {homeJobs.map((job) => (
              <article key={job.title} className="home-job-card" onClick={() => onNavigate('jobs')}>
                <span className="job-type-tag">{job.type}</span>
                <h3>{job.title}</h3>
                <p className="job-company">{job.company}</p>
                <div className="job-tags">
                  <span className="job-tag">{job.area}</span>
                  <span className="job-tag"><MapPin size={12} /> {job.location}</span>
                  <span className="job-tag">{job.modality}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="opportunity-heading section-heading" style={{ marginBottom: '32px' }}>
            <div><span className="section-kicker">Biblioteca First Step</span><h2>Apostilas e<br /><span>e-books gratuitos.</span></h2></div>
            <button className="underlined-link" onClick={() => onNavigate('ebooks')}>Ver todos <ArrowRight size={15} /></button>
          </div>
          <div className="ebook-carousel">
            {ebookCarouselItems.map((ebook) => (
              <div key={ebook.title} className="ebook-carousel-item" onClick={() => onNavigate('ebooks')}>
                <div className="ebook-carousel-cover"><div className="ebook-carousel-cover-placeholder"><BookOpen size={36} /></div></div>
                <h3>{ebook.title}</h3>
                <p>{ebook.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div className="ai-highlight">
            <div className="ai-highlight-visual"><img src={aiImage} alt="First Step IA" loading="lazy" /></div>
            <div className="ai-highlight-content">
              <span className="section-kicker">Inteligência Artificial</span>
              <h2>First Step <span>IA.</span></h2>
              <p>Sua assistente de carreira com inteligência artificial. Tire dúvidas sobre currículos, entrevistas, primeiro emprego, estágios e mais — de forma natural e personalizada.</p>
              <div className="ai-highlight-features">
                <div className="ai-highlight-feature"><span className="ai-highlight-feature-dot" /> Respostas personalizadas sobre carreira</div>
                <div className="ai-highlight-feature"><span className="ai-highlight-feature-dot" /> Dicas de currículo e entrevistas</div>
                <div className="ai-highlight-feature"><span className="ai-highlight-feature-dot" /> Orientação para primeiro emprego e estágios</div>
              </div>
              <button className="button button-blue" onClick={() => onNavigate('ai')}>Conversar com a IA <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="section community-section" id="comunidade" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="community-card">
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
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div className="site-shell">
      <Sidebar current={page} onNavigate={setPage} />
      <div className="main-content">
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
    </div>
  );
}

export default App;
