import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Bot,
  BookOpen,
  ChevronRight,
  Target,
  TrendingUp,
  Lightbulb,
  Play,
  ExternalLink,
} from 'lucide-react';
import { Sidebar, Footer, type PageId } from '@/components/Layout';
import { FeedPage } from '@/pages/FeedPage';
import { JobsPage } from '@/pages/JobsPage';
import { TipsPage } from '@/pages/TipsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EbooksPage } from '@/pages/EbooksPage';
import { AIPage } from '@/pages/AIPage';

const removeFloating = () => {
  document.querySelectorAll('[style^="position: fixed"][style*="bottom: 1rem"][style*="z-index: 2147483647"]').forEach(el => el.remove());
};

removeFloating();

const observer = new MutationObserver(removeFloating);
observer.observe(document.body, { childList: true, subtree: true });

const journeyCards = [
  { icon: Target, number: '01', title: 'Entenda seu caminho', text: 'Conte com clareza para descobrir possibilidades que combinam com você.' },
  { icon: TrendingUp, number: '02', title: 'Desenvolva seu potencial', text: 'Aprenda habilidades que fazem diferença nos estudos e no trabalho.' },
  { icon: BriefcaseBusiness, number: '03', title: 'Chegue mais preparado', text: 'Encontre oportunidades e dê os próximos passos com confiança.' },
];

const highlightCards = [
  { icon: BriefcaseBusiness, title: 'Vagas', text: 'Oportunidades reais de primeiro emprego, estágio e aprendiz.', page: 'jobs' as PageId },
  { icon: Lightbulb, title: 'Dicas', text: 'Tutoriais e orientações para entrar no mercado de trabalho.', page: 'tips' as PageId },
  { icon: BookOpen, title: 'E-books', text: 'Materiais gratuitos para acelerar sua jornada profissional.', page: 'ebooks' as PageId },
  { icon: Bot, title: 'First Step IA', text: 'Sua assistente pessoal com inteligência artificial.', page: 'ai' as PageId },
];

const homeTips = [
  { category: 'Entrevistas', title: 'Como se preparar para uma entrevista', summary: 'Pesquise a empresa, treine respostas comuns e chegue confiante.', img: 'https://images.pexels.com/photos/5668863/pexels-photo-5668863.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', source: 'First Step', date: '10 Nov 2026' },
  { category: 'Currículo', title: 'Como criar um currículo profissional', summary: 'Estrutura, linguagem e formatação para impressionar recrutadores.', img: 'https://images.pexels.com/photos/4101343/pexels-photo-4101343.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', source: 'First Step', date: '09 Nov 2026' },
  { category: 'Primeiro emprego', title: 'Como se comportar no primeiro emprego', summary: 'Comunicação, postura e dicas para se adaptar ao ambiente de trabalho.', img: 'https://images.pexels.com/photos/7654438/pexels-photo-7654438.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', source: 'First Step', date: '08 Nov 2026' },
];

const aiImage = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';
const heroImage = '';

const featuredEbook = {
  title: 'Guia do Primeiro Emprego',
  desc: 'Tudo o que você precisa saber para conseguir seu primeiro emprego: currículo, entrevistas e postura profissional.',
};

const homeCompanies = [
  { name: 'Nubank', logo: 'https://logo.clearbit.com/nubank.com.br', url: 'https://nubank.com.br/carreira/' },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', url: 'https://www.amazon.jobs/' },
  { name: 'McDonald\'s', logo: 'https://logo.clearbit.com/mcdonalds.com', url: 'https://br.mcdonalds.com/trabalhe-conosco.html' },
];

function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <main>
      <section className="hero hero-photo" id="inicio">
        <img src={heroImage} alt="First Step" className="hero-photo-img" />
        <div className="hero-grid" />
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="container hero-photo-overlay">
          <div className="hero-buttons">
            <button className="button button-blue" onClick={() => onNavigate('jobs')}>Começar agora <ArrowRight size={17} /></button>
            <button className="button button-ghost" onClick={() => onNavigate('ai')}><Play size={15} fill="currentColor" /> Conversar com a IA</button>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true"><span>LM</span><span>AS</span><span>JC</span><span>+</span></div>
            <div><strong>+12 mil jovens</strong><span>já deram o primeiro passo</span></div>
          </div>
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
            <div><span className="section-kicker">Dicas em destaque</span><h2>Orientação para<br /><span>começar com o pé direito.</span></h2></div>
            <button className="underlined-link" onClick={() => onNavigate('tips')}>Ver todas as dicas <ArrowRight size={15} /></button>
          </div>
          <div className="home-news-preview">
            {homeTips.map((item) => (
              <article key={item.title} className="home-news-card" onClick={() => onNavigate('tips')}>
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
            <div><span className="section-kicker">Oportunidades reais</span><h2>Empresas que estão<br /><span>contratando agora.</span></h2></div>
            <button className="underlined-link" onClick={() => onNavigate('jobs')}>Ver todas as vagas <ArrowRight size={15} /></button>
          </div>
          <div className="home-companies-preview">
            {homeCompanies.map((company) => (
              <a key={company.name} href={company.url} target="_blank" rel="noopener noreferrer" className="home-company-card">
                <div className="home-company-logo">
                  <img src={company.logo} alt={company.name} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <span className="home-company-name">{company.name}</span>
                <ExternalLink size={14} className="home-company-cta" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="opportunity-heading section-heading" style={{ marginBottom: '32px' }}>
            <div><span className="section-kicker">Biblioteca First Step</span><h2>E-book em<br /><span>destaque.</span></h2></div>
            <button className="underlined-link" onClick={() => onNavigate('ebooks')}>Ler agora <ArrowRight size={15} /></button>
          </div>
          <div className="home-featured-ebook" onClick={() => onNavigate('ebooks')}>
            <div className="home-featured-ebook-cover"><BookOpen size={48} /></div>
            <div className="home-featured-ebook-info">
              <span className="post-category">E-book gratuito</span>
              <h3>{featuredEbook.title}</h3>
              <p>{featuredEbook.desc}</p>
              <span className="underlined-link">Ler ou baixar <ArrowRight size={15} /></span>
            </div>
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
              <p>Sua assistente pessoal com inteligência artificial. Pergunte sobre qualquer assunto — estudos, carreira, dúvidas do dia a dia e muito mais.</p>
              <div className="ai-highlight-features">
                <div className="ai-highlight-feature"><span className="ai-highlight-feature-dot" /> Responde qualquer pergunta</div>
                <div className="ai-highlight-feature"><span className="ai-highlight-feature-dot" /> Ajuda com currículos e entrevistas</div>
                <div className="ai-highlight-feature"><span className="ai-highlight-feature-dot" /> Orientação sobre primeiro emprego e estágios</div>
              </div>
              <button className="button button-blue" onClick={() => onNavigate('ai')}>Conversar com a IA <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner">
          <div><span className="section-kicker">Seu momento é agora</span><h2>Todo grande caminho<br />começa com um passo.</h2></div>
          <button className="button button-blue" onClick={() => onNavigate('profile')}>Criar meu perfil <ArrowRight size={17} /></button>
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
        {page === 'jobs' && <JobsPage />}
        {page === 'tips' && <TipsPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'ebooks' && <EbooksPage />}
        {page === 'ai' && <AIPage />}
        <Footer onNavigate={setPage} />
      </div>
    </div>
  );
}

export default App;
