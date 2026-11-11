import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  HandHeart,
  Lightbulb,
  MessageSquare,
  Play,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { PageHero } from '@/components/Layout';

type Tip = {
  id: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  icon: typeof FileText;
  content: string[];
};

const TIPS_CATEGORIES = [
  'Todas',
  'Entrevistas',
  'Currículo',
  'Primeiro emprego',
  'Estágio e Aprendiz',
  'Direitos e deveres',
  'Desenvolvimento',
  'Comunicação',
] as const;

const TIPS: Tip[] = [
  {
    id: 'interview-prep',
    category: 'Entrevistas',
    title: 'Como se preparar para uma entrevista de emprego',
    summary: 'Do que levar até como responder perguntas difíceis — um guia completo para chegar confiante.',
    readTime: '6 min',
    icon: MessageSquare,
    content: [
      'Pesquise sobre a empresa: visite o site, entenda o que faz, seus valores e produtos. Recrutadores percebem quando você chega sabendo sobre eles.',
      'Prepare respostas para perguntas comuns: "Fale sobre você", "Quais seus pontos fortes?", "Por que quer esta vaga?". Treine em voz alta ou com um amigo.',
      'Leve cópias impressas do seu currículo, mesmo que já tenha enviado online. Chegue com 15 a 20 minutos de antecedência.',
      'Vista-se adequadamente para o ambiente da empresa. Na dúvida, prefira algo um pouco mais formal do que de menos.',
      'Mantenha contato visual, escute com atenção e seja honesto. Se não souber algo, diga que está aprendendo — atitude vale mais que respostas decoradas.',
      'No final, faça perguntas sobre a equipe, a rotina e as oportunidades de aprendizado. Isso demonstra interesse real.',
    ],
  },
  {
    id: 'resume-create',
    category: 'Currículo',
    title: 'Como criar um currículo profissional sem experiência',
    summary: 'Estrutura, linguagem e formatação para destacar suas habilidades mesmo no primeiro currículo.',
    readTime: '8 min',
    icon: FileText,
    content: [
      'Comece com seus dados de contato no topo: nome, telefone, e-mail e cidade. Não precisa de foto nem dados pessoais como RG.',
      'Escreva um objetivo claro e específico: em vez de "procuro oportunidade", diga "Estágio em Marketing Digital" ou "Jovem Aprendiz Administrativo".',
      'Inclua sua escolaridade, mesmo que esteja cursando. Especifique o período e a previsão de conclusão.',
      'Liste cursos que você fez, mesmo os gratuitos e online. Plataformas como Fundação Bradesco, Google e SENAC contam muito.',
      'Adicione projetos escolares, voluntariado ou atividades extracurriculares — mostram iniciativa e responsabilidades.',
      'Mantenha tudo em uma página, com fonte legível (tamanho 11-12), layout limpo e sem erros de português. Recrutadores valorizam organização mais que experiência prévia.',
    ],
  },
  {
    id: 'first-job-behavior',
    category: 'Primeiro emprego',
    title: 'Como se comportar no seu primeiro emprego',
    summary: 'Comunicação, postura e dicas para se adaptar ao ambiente de trabalho desde o primeiro dia.',
    readTime: '7 min',
    icon: BriefcaseBusiness,
    content: [
      'Chegue pontualmente. Nos primeiros dias, chegar 10 minutos mais cedo ajuda a se ambientar sem pressa.',
      'Anote tudo: nomes dos colegas, processos, senhas, atalhos. Um caderninho ou app de notas será seu melhor amigo no começo.',
      'Não tenha medo de perguntar. É melhor perguntar uma vez do que errar cinco vezes por vergonha. Mostre que está aprendendo.',
      'Aprenda a hierarquia e quem é responsável por quê. Respeite os canais de comunicação da empresa.',
      'Comunique-se de forma profissional por e-mail: use saudação, seja claro e objetivo, revise antes de enviar.',
      'Receba feedback sem levar para o lado pessoal. Críticas construtivas são oportunidades de crescimento, não ataques.',
    ],
  },
  {
    id: 'find-opportunities',
    category: 'Primeiro emprego',
    title: 'Como encontrar oportunidades de trabalho',
    summary: 'Onde buscar vagas, como usar plataformas e por que networking importa desde cedo.',
    readTime: '5 min',
    icon: TrendingUp,
    content: [
      'Use plataformas especializadas: First Step, Gupy, LinkedIn, Vagas.com e Catho. Crie perfis completos e mantenha atualizados.',
      'Ative alertas de vagas para receber notificações quando oportunidades que combinam com você aparecerem.',
      'Considere programas de Jovem Aprendiz — são excelentes portas de entrada para o mercado de trabalho formal.',
      'Visite sites das próprias empresas. Muitas têm páginas de carreiras com vagas que nem sempre chegam aos portais.',
      'Use sua rede: fale com professores, familiares e amigos sobre sua busca. Indicações ainda são uma das formas mais eficazes de conseguir entrevistas.',
      'Participe de eventos, feiras de emprego e workshops. Cada conexão pode virar uma oportunidade no futuro.',
    ],
  },
  {
    id: 'stand-out-selection',
    category: 'Entrevistas',
    title: 'Como se destacar em processos seletivos',
    summary: 'Diferenciais que colocam você à frente de outros candidatos em dinâmicas e testes.',
    readTime: '6 min',
    icon: Sparkles,
    content: [
      'Em dinâmicas de grupo, equilibre participação: fale o suficiente para ser notado, mas escute os outros. Dominar a conversa prejudica mais do que ajuda.',
      'Nos testes online, leia as instruções com calma. Se for lógica ou raciocínio, pratique com exercícios gratuitos antes.',
      'Personalize cada candidatura: adapte seu currículo e carta de apresentação para a vaga específica.',
      'Mostre vontade de aprender. Empresas valorizam atitude e potencial muito mais que conhecimento prévio em candidatos juniores.',
      'Mande uma mensagem de agradecimento após a entrevista. É um gesto simples que poucos fazem e que te diferencia.',
      'Se não passar, peça feedback. Entender onde pode melhorar transforma uma derrota em aprendizado.',
    ],
  },
  {
    id: 'internship-apprentice',
    category: 'Estágio e Aprendiz',
    title: 'Estágio e Jovem Aprendiz: oportunidades e diferenças',
    summary: 'Entenda como funcionam os dois principais programas de entrada no mercado de trabalho.',
    readTime: '7 min',
    icon: GraduationCap,
    content: [
      'Estágio: voltado para estudantes de ensino superior ou técnico. Exige matrícula ativa. A carga horária costuma ser de 4 a 6 horas/dia.',
      'Jovem Aprendiz: programa formal para jovens de 14 a 24 anos com matrícula na escola. Combina trabalho e aprendizagem teórica.',
      'Ambos oferecem bolsa-auxílio ou salário, vale-transporte e experiência prática — são portas de entrada seguras para o mercado.',
      'Para estágio, destaque projetos acadêmicos no currículo. Para aprendiz, mostre vontade de aprender e disponibilidade.',
      'Processos seletivos de grandes empresas costumam abrir entre agosto e novembro. Fique atento aos prazos!',
      'Cursos gratuitos enriquecem seu perfil para ambos. Invista em habilidades que combinem com a área que deseja.',
    ],
  },
  {
    id: 'rights-duties',
    category: 'Direitos e deveres',
    title: 'Direitos e deveres do trabalhador jovem',
    summary: 'O que você precisa saber sobre CLT, carteira de trabalho e seus direitos desde o primeiro emprego.',
    readTime: '8 min',
    icon: Shield,
    content: [
      'Carteira de trabalho (CTPS) é obrigatória para qualquer emprego formal. Peça a sua gratuitamente pelo app Carteira de Trabalho Digital.',
      'Jornada de trabalho: no CLT, o máximo é 8 horas/dia e 44 horas/semana. Horas extras devem ser pagas com acréscimo.',
      'Você tem direito a férias remuneradas após 12 meses, 13º salário, FGTS (8% depositado pelo empregador) e INSS.',
      'Estagiários e aprendizes têm regras próprias (Lei do Estágio e Lei da Aprendizagem), com jornada reduzida e bolsa-auxílio.',
      'Assédio moral ou sexual é crime. Se acontecer, procure o RH, um sindicato ou o Canal de Denúncias do Ministério do Trabalho.',
      'Seus deveres: cumprir o horário, seguir as normas da empresa, tratar todos com respeito e zelar pelos materiais de trabalho.',
    ],
  },
  {
    id: 'professional-development',
    category: 'Desenvolvimento',
    title: 'Desenvolvimento profissional: por onde começar',
    summary: 'Hard skills, soft skills e fontes gratuitas para evoluir desde cedo na carreira.',
    readTime: '6 min',
    icon: TrendingUp,
    content: [
      'Hard skills: invista em cursos da sua área de interesse. Pacote Office, Google Workspace e noções de análise de dados são úteis em qualquer carreira.',
      'Soft skills são as mais valorizadas: comunicação, pensamento crítico, adaptabilidade, trabalho em equipe e proatividade.',
      'Fontes gratuitas: Google Ateliê, SENAC, Fundação Bradesco, Coursera (audit free), Sebrae e Curso em Vídeo.',
      'Livros e podcasts sobre desenvolvimento pessoal aceleram seu crescimento. Busque recomendações de profissionais da área que admira.',
      'Peça feedback a quem convive com você — professores, colegas, chefes. É difícil enxergar os próprios pontos cegos.',
      'Networking e mentoria aceleram muito. Conecte-se com profissionais da área e participe de comunidades como a First Step.',
    ],
  },
  {
    id: 'workplace-communication',
    category: 'Comunicação',
    title: 'Comunicação e comportamento no ambiente de trabalho',
    summary: 'Como se expressar bem, resolver conflitos e construir boas relações profissionais.',
    readTime: '5 min',
    icon: Users,
    content: [
      'Seja claro e objetivo em e-mails e mensagens. Comece com uma saudação, vá direto ao ponto e revise antes de enviar.',
      'Escute antes de responder. Repetir o que ouviu em suas palavras evita mal-entendidos frequentes.',
      'Em conflitos, foque no problema, não na pessoa. Use "eu sinto" em vez de "você sempre" para não soar acusatório.',
      'Respeite o tempo e o espaço dos colegas. Nem tudo é urgente — aprenda a diferenciar o que precisa de resposta imediata.',
      'Reconheça o trabalho dos outros. Um "obrigado" sincero fortalece relações e cria um ambiente mais saudável.',
      'Cuidado com redes sociais: não poste reclamações sobre o trabalho ou colegas. Sua imagem profissional está sempre em jogo.',
    ],
  },
];

const FEATURED_VIDEO = {
  title: 'Primeiro Emprego: a jornada real de quem conseguiu',
  description: 'Neste episódio especial, o time First Step conversa com jovens que conseguiram seu primeiro emprego, estágio ou vaga de aprendiz. Eles compartilham os desafios, as estratégias que funcionaram e os erros que serviram de aprendizado. Uma conversa real, sem roteiro, para inspirar quem está começando agora.',
  thumbnail: 'https://images.pexels.com/photos/6883807/pexels-photo-6883807.jpeg?auto=compress&cs=tinysrgb&h=720&w=1280',
  duration: '24:18',
  videoUrl: '',
};

export function TipsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const filteredTips = activeCategory === 'Todas'
    ? TIPS
    : TIPS.filter((t) => t.category === activeCategory);

  if (selectedTip) {
    const Icon = selectedTip.icon;
    return (
      <section className="section page-section">
        <div className="container narrow-container">
          <button className="back-btn" onClick={() => setSelectedTip(null)}>
            <ArrowRight size={16} className="rotate-180" /> Voltar para dicas
          </button>
          <article className="tip-detail">
            <div className="tip-detail-header">
              <div className="tip-detail-icon"><Icon size={24} /></div>
              <div>
                <span className="post-category">{selectedTip.category}</span>
                <h2>{selectedTip.title}</h2>
                <div className="tip-detail-meta">
                  <span><Clock size={13} /> {selectedTip.readTime} de leitura</span>
                  <span><Sparkles size={13} /> First Step</span>
                </div>
              </div>
            </div>
            <p className="tip-detail-summary">{selectedTip.summary}</p>
            <div className="tip-detail-content">
              {selectedTip.content.map((item, i) => (
                <div key={i} className="tip-detail-item">
                  <span className="tip-detail-num">{i + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="tip-detail-cta">
              <Sparkles size={18} />
              <div>
                <strong>Quer ajuda personalizada?</strong>
                <p>Converse com a First Step IA para tirar dúvidas e montar seu currículo.</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero kicker="Dicas" title={<>Orientação para <span className="text-blue-450">começar certo.</span></>}
        subtitle="Tutoriais práticos sobre entrevistas, currículo, primeiro emprego, estágio, direitos do trabalhador e desenvolvimento profissional — tudo para te ajudar a entrar no mercado de trabalho." />
      <section className="section page-section">
        <div className="container">
          {/* Featured video */}
          <div className="tips-featured-video">
            <div className="tips-video-label">
              <Sparkles size={14} /> Conteúdo original First Step
            </div>
            <div className="tips-video-card">
              <div className="tips-video-thumbnail" onClick={() => setVideoOpen(true)} role="button" tabIndex={0}>
                <img src={FEATURED_VIDEO.thumbnail} alt={FEATURED_VIDEO.title} loading="lazy" />
                <div className="tips-video-overlay" />
                <div className="tips-video-play">
                  <Play size={32} fill="currentColor" />
                </div>
                <span className="tips-video-duration">{FEATURED_VIDEO.duration}</span>
              </div>
              <div className="tips-video-body">
                <span className="post-category">Vídeo em destaque</span>
                <h2>{FEATURED_VIDEO.title}</h2>
                <p>{FEATURED_VIDEO.description}</p>
                <div className="tips-video-actions">
                  <button className="button button-blue" onClick={() => setVideoOpen(true)}>
                    <Play size={16} fill="currentColor" /> Assistir agora
                  </button>
                  <span className="tips-video-source">
                    <Sparkles size={14} /> Produção original First Step
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Video modal */}
          {videoOpen && (
            <div className="tips-video-modal" onClick={() => setVideoOpen(false)}>
              <div className="tips-video-modal-inner" onClick={(e) => e.stopPropagation()}>
                <button className="tips-video-modal-close" onClick={() => setVideoOpen(false)} aria-label="Fechar">
                  <X size={22} />
                </button>
                <div className="tips-video-embed">
                  {FEATURED_VIDEO.videoUrl ? (
                    <iframe
                      src={FEATURED_VIDEO.videoUrl}
                      title={FEATURED_VIDEO.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="tips-video-placeholder">
                      <Play size={48} />
                      <p>Em breve: o vídeo será inserido aqui.</p>
                      <span>Para inserir seu vídeo, adicione a URL (YouTube/Embed) na constante FEATURED_VIDEO no arquivo TipsPage.tsx</span>
                    </div>
                  )}
                </div>
                <div className="tips-video-modal-info">
                  <span className="post-category">Conteúdo original First Step</span>
                  <h3>{FEATURED_VIDEO.title}</h3>
                  <p>{FEATURED_VIDEO.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Category filter */}
          <div className="forum-toolbar" style={{ marginBottom: '32px', marginTop: '48px' }}>
            <div className="forum-categories">
              {TIPS_CATEGORIES.map((cat) => (
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

          {/* Tips grid */}
          <div className="tips-grid">
            {filteredTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <article key={tip.id} className="tip-card" onClick={() => setSelectedTip(tip)}>
                  <div className="tip-card-top">
                    <div className="tip-card-icon"><Icon size={20} /></div>
                    <span className="tip-card-cat">{tip.category}</span>
                  </div>
                  <h3>{tip.title}</h3>
                  <p>{tip.summary}</p>
                  <div className="tip-card-footer">
                    <span><Clock size={12} /> {tip.readTime}</span>
                    <span className="tip-card-read">Ler dica <ArrowRight size={13} /></span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
