import { useState, type ReactNode } from 'react';
import {
  ArrowRight,
  House,
  Menu,
  MessageCircle,
  BriefcaseBusiness,
  Newspaper,
  GraduationCap,
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

export function Sidebar({ current, onNavigate }: { current: PageId; onNavigate: (page: PageId) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (page: PageId) => { onNavigate(page); setMobileOpen(false); };

  return (
    <>
      <header className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button>
        <button className="mobile-brand" onClick={() => go('home')} aria-label="First Step"><img src="/logo.png" alt="First Step" className="sidebar-logo" /></button>
        <div style={{ width: 22 }} />
      </header>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-brand" onClick={() => go('home')} aria-label="First Step">
            <img src="/logo.png" alt="First Step" className="sidebar-logo" />
            <span className="sidebar-brand-text">First<span>Step</span></span>
          </button>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fechar"><X size={20} /></button>
        </div>
        <nav className="sidebar-nav" aria-label="Navegação">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => go(id)} className={`sidebar-nav-item ${current === id ? 'active' : ''}`}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-cta">
            <div className="sidebar-cta-icon"><ArrowRight size={16} /></div>
            <div><strong>Pronto para começar?</strong><span>Crie seu perfil e dê o primeiro passo.</span></div>
          </div>
          <button className="button button-blue button-small sidebar-cta-btn" onClick={() => go('profile')}>Meu perfil <ArrowRight size={14} /></button>
        </div>
      </aside>
    </>
  );
}

export function Footer({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div><strong>First Step</strong><span>Feito para quem está começando.</span></div>
        </div>
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
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
