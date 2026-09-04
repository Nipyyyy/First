import { useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  House,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Início', href: '#inicio', icon: House },
  { label: 'Jornada', href: '#jornada', icon: Compass },
  { label: 'Oportunidades', href: '#oportunidades', icon: BriefcaseBusiness },
  { label: 'Comunidade', href: '#comunidade', icon: Users },
];

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

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#inicio" aria-label="First Step início" onClick={closeMenu}>
            <span className="brand-mark"><Sparkles size={17} strokeWidth={2.3} /></span>
            <span>first<span>step</span></span>
          </a>

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
            {navItems.map(({ label, href, icon: Icon }) => (
              <a href={href} key={label} onClick={closeMenu} className={label === 'Início' ? 'active' : ''}>
                <Icon size={15} />
                {label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="text-link" href="#comunidade">Entrar</a>
            <a className="button button-small button-blue" href="#jornada">Começar agora <ArrowRight size={15} /></a>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

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
              <a className="button button-blue" href="#jornada">Começar agora <ArrowRight size={17} /></a>
              <a className="button button-ghost" href="#oportunidades"><Play size={15} fill="currentColor" /> Explorar oportunidades</a>
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
                  <h3>{title}</h3><p>{text}</p><a href="#oportunidades" aria-label={`Saiba mais sobre ${title}`}><ChevronRight size={18} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section opportunity-section" id="oportunidades">
          <div className="container">
            <div className="section-heading opportunity-heading"><div><span className="section-kicker">Oportunidades reais</span><h2>O próximo passo<br /><span>está mais perto.</span></h2></div><a className="underlined-link" href="#oportunidades">Ver todas as oportunidades <ArrowRight size={15} /></a></div>
            <div className="opportunity-list">
              {opportunities.map((item) => <article className="opportunity-row" key={item.title}><div className="opportunity-logo"><BriefcaseBusiness size={19} /></div><div className="opportunity-main"><span className="opportunity-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.company}</p></div><div className="opportunity-meta"><span>{item.location}</span><span>{item.type}</span></div><button className="row-arrow" aria-label={`Ver ${item.title}`}><ArrowRight size={17} /></button></article>)}
            </div>
          </div>
        </section>

        <section className="section community-section" id="comunidade">
          <div className="container community-card">
            <div className="community-copy"><span className="section-kicker">Você faz parte disso</span><h2>Aprender é melhor<br /><span>quando é junto.</span></h2><p>Troque experiências, tire dúvidas e encontre inspiração em uma comunidade que está construindo o futuro.</p><a className="button button-light" href="#inicio">Conhecer a comunidade <ArrowRight size={16} /></a></div>
            <div className="community-art"><div className="art-circle art-circle-large" /><div className="art-circle art-circle-small" /><div className="quote-card"><MessageCircle size={17} /><p>“Você é capaz de ir muito mais longe.”</p><span>— Ana, comunidade First Step</span></div><div className="art-stat"><strong>93%</strong><span>se sentem mais preparados</span></div></div>
          </div>
        </section>

        <section className="final-cta"><div className="container final-cta-inner"><div><span className="section-kicker">Seu momento é agora</span><h2>Todo grande caminho<br />começa com um passo.</h2></div><a className="button button-blue" href="#inicio">Começar minha jornada <ArrowRight size={17} /></a></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><a className="brand" href="#inicio"><span className="brand-mark"><Sparkles size={17} strokeWidth={2.3} /></span><span>first<span>step</span></span></a><span>Feito para quem está começando.</span><div className="footer-links"><a href="#jornada">Sobre nós</a><a href="#comunidade">Contato</a><a href="#inicio">Privacidade</a></div></div></footer>
    </div>
  );
}

export default App;
