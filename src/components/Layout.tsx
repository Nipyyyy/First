import { useState, type ReactNode } from 'react';
import {
  ArrowRight,
  House,
  Menu,
  MessageCircle,
  BriefcaseBusiness,
  Newspaper,
  GraduationCap,
  Sparkles,
  X,
  Rss,
  UserCircle,
  BookOpen,
  Bot,
  Layers,
  PlayCircle,
} from 'lucide-react';

export type PageId = 'home' | 'feed' | 'forum' | 'jobs' | 'news' | 'senac' | 'profile' | 'ebooks' | 'ai' | 'content' | 'courses';

export const NAV_ITEMS: { id: PageId; label: string; icon: typeof House }[] = [
  { id: 'home', label: 'Início', icon: House },
  { id: 'feed', label: 'Feed', icon: Rss },
  { id: 'forum', label: 'Fórum', icon: MessageCircle },
  { id: 'jobs', label: 'Vagas', icon: BriefcaseBusiness },
  { id: 'news', label: 'Notícias', icon: Newspaper },
  { id: 'courses', label: 'Cursos', icon: PlayCircle },
  { id: 'ebooks', label: 'E-books', icon: BookOpen },
  { id: 'content', label: 'Conteúdos', icon: Layers },
  { id: 'ai', label: 'First Step IA', icon: Bot },
  { id: 'senac', label: 'SENAC', icon: GraduationCap },
  { id: 'profile', label: 'Perfil', icon: UserCircle },
];

type NavbarProps = {
  current: PageId;
  onNavigate: (page: PageId) => void;
};

export function Navbar({ current, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (page: PageId) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand" onClick={() => go('home')} aria-label="First Step início">
          <span className="brand-mark"><Sparkles size={17} strokeWidth={2.3} /></span>
          <span>first<span>step</span></span>
        </button>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={current === id ? 'active' : ''}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="button button-small button-blue" onClick={() => go('profile')}>
            Meu perfil <ArrowRight size={15} />
          </button>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export function Footer({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <button className="brand" onClick={() => onNavigate('home')}>
          <span className="brand-mark"><Sparkles size={17} strokeWidth={2.3} /></span>
          <span>first<span>step</span></span>
        </button>
        <span>Feito para quem está começando.</span>
        <div className="footer-links">
          <button onClick={() => onNavigate('feed')}>Feed</button>
          <button onClick={() => onNavigate('forum')}>Fórum</button>
          <button onClick={() => onNavigate('jobs')}>Vagas</button>
          <button onClick={() => onNavigate('news')}>Notícias</button>
          <button onClick={() => onNavigate('courses')}>Cursos</button>
          <button onClick={() => onNavigate('ebooks')}>E-books</button>
          <button onClick={() => onNavigate('content')}>Conteúdos</button>
          <button onClick={() => onNavigate('ai')}>First Step IA</button>
          <button onClick={() => onNavigate('senac')}>SENAC</button>
          <button onClick={() => onNavigate('profile')}>Perfil</button>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ kicker, title, subtitle }: { kicker: string; title: ReactNode; subtitle: string }) {
  return (
    <section className="page-hero">
      <div className="hero-grid" />
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="container page-hero-content">
        <span className="section-kicker">{kicker}</span>
        <h1 className="page-h1">{title}</h1>
        <p className="page-hero-copy">{subtitle}</p>
      </div>
    </section>
  );
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d atrás`;
  return date.toLocaleDateString('pt-BR');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
