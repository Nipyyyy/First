import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowLeft, BookOpen, Briefcase, Bot, Calendar, Check, Download, FileText,
  GraduationCap, Lightbulb, MessageCircle, Pencil, Plus, Send, Sparkles, Trash2, TrendingUp, User, X,
} from 'lucide-react';
import { PageHero } from '@/components/Layout';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const TOPIC_ICONS: Record<string, typeof FileText> = {
  Currículos: FileText, Entrevistas: MessageCircle, 'Primeiro emprego': Briefcase,
  Estágios: GraduationCap, Carreira: TrendingUp, Estudos: BookOpen,
  Organização: Calendar, 'Desenvolvimento profissional': Sparkles,
};

const SUGGESTED_PROMPTS = [
  'Como montar um currículo sem experiência?',
  'O que dizer em uma entrevista de estágio?',
  'Como conseguir meu primeiro emprego?',
  'Quais habilidades devo desenvolver?',
];

const EMPLOYMENT_TYPES = [
  { value: 'clt', label: 'CLT / Efetivo' },
  { value: 'internship', label: 'Estágio' },
  { value: 'apprentice', label: 'Jovem Aprendiz' },
] as const;

type ResumeData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  employmentType: string;
  objective: string;
  education: string;
  institution: string;
  educationStatus: string;
  skills: string[];
  courses: { title: string; institution: string }[];
  experiences: { title: string; company: string; period: string; description: string }[];
  projects: { title: string; description: string }[];
  languages: string[];
  about: string;
};

const EMPTY_RESUME: ResumeData = {
  fullName: '', email: '', phone: '', city: '', profession: '', employmentType: 'clt',
  objective: '', education: '', institution: '', educationStatus: 'Cursando',
  skills: [], courses: [], experiences: [], projects: [], languages: [], about: '',
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  if (lower.includes('currículo') || lower.includes('curriculo') || lower.includes('resume')) {
    return 'Montar um currículo sem experiência é mais fácil do que parece! Aqui vai um roteiro prático:\n\n1. Comece com seus dados de contato no topo (nome, telefone, e-mail, cidade).\n2. Escreva um resumo curto — 2 ou 3 linhas sobre quem você é e o que busca.\n3. Coloque sua escolaridade, mesmo que esteja cursando.\n4. Liste cursos que você fez, mesmo os gratuitos e online.\n5. Adicione projetos, voluntariado ou atividades da escola — isso mostra iniciativa.\n6. Inclua habilidades como comunicação, organização ou ferramentas que você usa.\n\nDica importante: mantenha tudo em uma página, com layout limpo e sem erros de português. Recrutadores valorizam muito mais vontade de aprender e organização do que experiência prévia. Quer que eu te ajude a escrever o resumo? Você também pode usar o Construtor de Currículo logo abaixo!';
  }
  if (lower.includes('entrevista')) {
    return 'Entrevistas podem ser nervosas, mas com preparação dá pra chegar confiante! Veja o que fazer:\n\nAntes:\n- Pesquise sobre a empresa (o que faz, valores, cultura).\n- Prepare respostas para perguntas comuns: "Fale sobre você", "Quais seus pontos fortes?", "Por que quer esta vaga?".\n- Treine em frente ao espelho ou com um amigo.\n\nDurante:\n- Vista-se adequadamente para o ambiente da empresa.\n- Mantenha contato visual e escute com atenção.\n- Seja honesto — se não souber algo, diga que está aprendendo.\n- Faça perguntas ao final (sobre a equipe, rotina, aprendizado). Isso demonstra interesse!\n\nDepois:\n- Envie uma mensagem agradecendo pela oportunidade.\n\nLembre-se: ninguém espera que um jovem em busca do primeiro emprego saiba tudo. O que importa é sua atitude e vontade de aprender!';
  }
  if (lower.includes('primeiro emprego') || lower.includes('primeiro trabalho') || lower.includes('como conseguir emprego')) {
    return 'Conseguir seu primeiro emprego é um processo — vamos por partes:\n\n1. Prepare seu currículo (posso te ajudar com isso!).\n2. Busque vagas em plataformas como First Step, Gupy, LinkedIn e Vagas.com.\n3. Considere programas de jovem aprendiz — são excelentes portas de entrada.\n4. Faça cursos gratuitos (Google, SENAC, Fundação Bradesco) para enriquecer o currículo.\n5. Pratique para entrevistas — simule perguntas e respostas.\n6. Use sua rede: fale com professores, familiares e amigos sobre sua busca.\n7. Não desista! Persistência é a chave. Cada entrevista é aprendizado.\n\nVocê já tem um currículo pronto? Se não, posso te orientar a montar um agora mesmo.';
  }
  if (lower.includes('estágio') || lower.includes('estagio')) {
    return 'Estágios são uma das melhores formas de entrar no mercado! Veja como se preparar:\n\nRequisitos comuns:\n- Estar cursando ensino superior ou técnico.\n- Ter disponibilidade (muitos aceitam 4 ou 6 horas/dia).\n\nOnde buscar:\n- Plataformas especializadas (First Step, Catho, LinkedIn).\n- Sites das próprias empresas (muitas têm programas anuais).\n- Centro de estágios da sua instituição de ensino.\n\nComo se destacar:\n- Destaque projetos acadêmicos no currículo.\n- Mostre vontade de aprender — muitas empresas valorizam atitude mais que experiência.\n- Prepare-se para dinâmicas de grupo e testes online.\n\nDica: muitos processos seletivos de estágio abrem entre agosto e novembro. Fique atento aos prazos!';
  }
  if (lower.includes('carreira') || lower.includes('profissão') || lower.includes('profissao') || lower.includes('futuro profissional')) {
    return 'Construir uma carreira é um processo contínuo de descobertas. Aqui vão orientações:\n\nComece definindo seus objetivos:\n- O que você gosta de fazer? O que te desperta curiosidade?\n- Não precisa saber exatamente agora — explore diferentes áreas!\n\nDesenvolva-se constantemente:\n- Aprenda algo novo sempre (cursos, livros, vídeos, podcasts).\n- Soft skills como comunicação e adaptabilidade são tão importantes quanto habilidades técnicas.\n\nFaça networking:\n- Conecte-se com profissionais da área que te interessa.\n- Participe de eventos, workshops e comunidades online.\n\nNão tenha medo de começar de baixo:\n- O importante é dar o primeiro passo e construir gradualmente.\n- Cada experiência, por menor que pareça, te ensina algo valioso.\n\nQuer explorar uma área específica? Me diz qual e te ajudo com um plano!';
  }
  if (lower.includes('estud') || lower.includes('aprender') || lower.includes('estudar') || lower.includes('concurso') || lower.includes('prova')) {
    return 'Estudar de forma eficaz é uma habilidade que vale para a vida toda! Aqui vão técnicas que funcionam:\n\nOrganização:\n- Crie uma rotina com horários fixos de estudo.\n- Divida o conteúdo em pequenos blocos — não tente aprender tudo de uma vez.\n\nTécnicas comprovadas:\n- Pomodoro: 25 min de estudo + 5 min de descanso, repita.\n- Resumos e mapas mentais ajudam a fixar o conteúdo.\n- Pratique com exercícios — aprender é diferente de apenas ler.\n- Ensine alguém (ou fale em voz alta) para testar se realmente entendeu.\n\nCuidado essencial:\n- Não deixe para a última hora — revisões espaçadas funcionam melhor.\n- Descanso faz parte do processo! Sono adequado melhora a memória.\n- Cuidado do ambiente: um lugar organizado e sem distrações faz diferença.\n\nQuer que eu te ajude a montar um cronograma de estudos?';
  }
  if (lower.includes('organiz') || lower.includes('produtiv') || lower.includes('tempo') || lower.includes('agenda')) {
    return 'Se organizar bem é a base de tudo! Aqui vão estratégias práticas:\n\nFerramentas úteis (e gratuitas):\n- Google Calendar para agendar compromissos e lembretes.\n- Notion ou Trello para organizar tarefas e projetos.\n- Google Keep para anotações rápidas.\n\nMétodos que funcionam:\n- Divida tarefas grandes em pequenas e realizáveis.\n- Priorize por urgência e importância (Matriz de Eisenhower).\n- Estabeleça metas semanais e revise seu progresso todo fim de semana.\n- O método GTD (Getting Things Done) é ótimo: capture tudo, depois organize.\n\nDicas de ouro:\n- Faça uma coisa de cada vez — multitarefa reduz a qualidade.\n- Reserve tempo para o inesperado — nem tudo sai como planejado.\n- Celebre pequenas conquistas — isso mantém a motivação!\n\nPosso te ajudar a criar uma rotina específica para sua situação. Como está sua rotina hoje?';
  }
  if (lower.includes('desenvolv') || lower.includes('habilidade') || lower.includes('crescer') || lower.includes('evoluir') || lower.includes('soft skill')) {
    return 'Desenvolvimento profissional é um investimento em você mesmo! Veja por onde começar:\n\nHabilidades técnicas (hard skills):\n- Invista em cursos da sua área de interesse.\n- Aprenda ferramentas digitais básicas: pacote Office, Google Workspace.\n- Explore áreas em alta: marketing digital, análise de dados, programação básica.\n\nHabilidades comportamentais (soft skills) — as mais valorizadas:\n- Comunicação clara e eficaz.\n- Pensamento crítico e resolução de problemas.\n- Adaptabilidade e flexibilidade.\n- Trabalho em equipe e colaboração.\n- Proatividade — antecipar necessidades sem esperar pedirem.\n- Inteligência emocional — saber lidar com emoções e pressões.\n\nOnde desenvolver:\n- Cursos gratuitos: Google Ateliê, SENAC, Fundação Bradesco, Coursera.\n- Livros e podcasts sobre desenvolvimento pessoal.\n- Busque feedback de pessoas que você convive.\n- Networking e mentoria aceleram muito seu crescimento.\n\nQual dessas áreas você gostaria de desenvolver primeiro?';
  }
  if (lower.includes('olá') || lower.includes('ola') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa tarde') || lower.includes('boa noite')) {
    return 'Olá! Que bom ter você aqui. Sou a First Step IA, sua assistente de carreira. Posso te ajudar com:\n- Montagem de currículo\n- Preparação para entrevistas\n- Como conseguir o primeiro emprego ou estágio\n- Dicas de estudos e organização\n- Desenvolvimento profissional e habilidades\n\nSobre o que você quer conversar hoje?';
  }
  if (lower.includes('obrigado') || lower.includes('obrigada') || lower.includes('valeu') || lower.includes('agradec')) {
    return 'Disponha! Estou aqui sempre que precisar. Se tiver mais alguma dúvida sobre carreira, estudos ou o mercado de trabalho, é só perguntar. Você consegue!';
  }
  return 'Essa é uma pergunta interessante! Sou a First Step IA e posso te ajudar principalmente com:\n\n- Currículos: como montar, o que incluir, como se destacar.\n- Entrevistas: preparação, perguntas comuns, como se comportar.\n- Primeiro emprego: por onde começar, plataformas, programas de aprendiz.\n- Estágios: requisitos, onde buscar, como se preparar.\n- Carreira: definição de objetivos, networking, crescimento.\n- Estudos: técnicas de aprendizagem, organização, cronogramas.\n- Organização: ferramentas, métodos de produtividade, gestão de tempo.\n- Desenvolvimento profissional: habilidades, cursos, soft skills.\n\nTente me perguntar sobre algum desses temas! Por exemplo: "Como montar um currículo sem experiência?"';
}

/* === AI Resume Builder === */

function improveText(text: string): string {
  if (!text.trim()) return text;
  let result = text.trim();
  result = result.replace(/\s+/g, ' ');
  result = result.charAt(0).toUpperCase() + result.slice(1);
  if (!result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) {
    result += '.';
  }
  return result;
}

function generateObjective(profession: string, employmentType: string): string {
  if (!profession.trim()) return '';
  const typeLabel = employmentType === 'clt' ? 'efetivo' : employmentType === 'internship' ? 'estágio' : 'jovem aprendiz';
  return `Buscar oportunidade como ${typeLabel} na área de ${profession}, onde possa aplicar e desenvolver minhas habilidades, contribuir para a equipe e crescer profissionalmente.`;
}

function improveAbout(about: string, profession: string, employmentType: string): string {
  if (!about.trim()) return '';
  let result = improveText(about);
  if (profession.trim() && !result.toLowerCase().includes(profession.toLowerCase())) {
    result = `Profissional com interesse na área de ${profession}. ${result}`;
  }
  return result;
}

function generateResumeHTML(data: ResumeData): string {
  const skillList = data.skills.join(' · ');
  const certList = data.courses.map((c) => `<li><strong>${c.title}</strong>${c.institution ? ` — ${c.institution}` : ''}</li>`).join('');
  const expList = data.experiences.map((e) => `
    <div class="exp-item">
      <div class="exp-header"><strong>${e.title}</strong> <span>${e.company}</span></div>
      <div class="exp-date">${e.period}</div>
      ${e.description ? `<p>${e.description}</p>` : ''}
    </div>`).join('');
  const prjList = data.projects.map((p) => `<li><strong>${p.title}</strong>${p.description ? `: ${p.description}` : ''}</li>`).join('');
  const langList = data.languages.join(' · ');

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Currículo - ${data.fullName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 48px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 28px; color: #0f172a; letter-spacing: -.02em; }
    .contact { color: #475569; font-size: 12px; margin-bottom: 8px; }
    .contact span { margin-right: 16px; }
    .status { color: #2563eb; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    h2 { font-size: 14px; color: #2563eb; text-transform: uppercase; letter-spacing: .08em; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0; }
    .about { font-size: 13px; color: #334155; line-height: 1.7; }
    .skills { font-size: 13px; color: #334155; }
    ul { list-style: none; padding: 0; }
    ul li { font-size: 13px; color: #334155; margin-bottom: 6px; padding-left: 14px; position: relative; }
    ul li::before { content: '▸'; position: absolute; left: 0; color: #2563eb; }
    .exp-item { margin-bottom: 14px; }
    .exp-header { font-size: 13px; }
    .exp-header span { color: #64748b; font-weight: 400; }
    .exp-date { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
    .exp-item p { font-size: 12px; color: #475569; }
    @media print { body { padding: 24px; } }
  </style></head><body>
  <h1>${data.fullName || 'Seu nome'}</h1>
  <div class="contact">
    ${data.email ? `<span>✉ ${data.email}</span>` : ''}
    ${data.phone ? `<span>☎ ${data.phone}</span>` : ''}
    ${data.city ? `<span>📍 ${data.city}</span>` : ''}
  </div>
  <div class="status">${data.objective}</div>
  ${data.about ? `<h2>Resumo</h2><p class="about">${data.about}</p>` : ''}
  <h2>Formação</h2>
  <p class="about"><strong>${data.education || ''}</strong>${data.institution ? ` — ${data.institution}` : ''}${data.educationStatus ? ` (${data.educationStatus})` : ''}</p>
  ${data.skills.length ? `<h2>Habilidades</h2><p class="skills">${skillList}</p>` : ''}
  ${data.experiences.length ? `<h2>Experiências</h2>${expList}` : ''}
  ${data.courses.length ? `<h2>Cursos e Certificações</h2><ul>${certList}</ul>` : ''}
  ${data.projects.length ? `<h2>Projetos e Atividades</h2><ul>${prjList}</ul>` : ''}
  ${data.languages.length ? `<h2>Idiomas</h2><p class="skills">${langList}</p>` : ''}
  </body></html>`;
}

type BuilderStep = 'form' | 'review';

function ResumeBuilder() {
  const [step, setStep] = useState<BuilderStep>('form');
  const [data, setData] = useState<ResumeData>(EMPTY_RESUME);
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [generating, setGenerating] = useState(false);

  const update = (field: keyof ResumeData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };
  const removeSkill = (i: number) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));
  };

  const addLang = () => {
    if (!langInput.trim()) return;
    setData((prev) => ({ ...prev, languages: [...prev.languages, langInput.trim()] }));
    setLangInput('');
  };
  const removeLang = (i: number) => {
    setData((prev) => ({ ...prev, languages: prev.languages.filter((_, idx) => idx !== i) }));
  };

  const addCourse = () => {
    setData((prev) => ({ ...prev, courses: [...prev.courses, { title: '', institution: '' }] }));
  };
  const updateCourse = (i: number, field: 'title' | 'institution', value: string) => {
    setData((prev) => ({ ...prev, courses: prev.courses.map((c, idx) => idx === i ? { ...c, [field]: value } : c) }));
  };
  const removeCourse = (i: number) => {
    setData((prev) => ({ ...prev, courses: prev.courses.filter((_, idx) => idx !== i) }));
  };

  const addExperience = () => {
    setData((prev) => ({ ...prev, experiences: [...prev.experiences, { title: '', company: '', period: '', description: '' }] }));
  };
  const updateExperience = (i: number, field: keyof typeof data.experiences[0], value: string) => {
    setData((prev) => ({ ...prev, experiences: prev.experiences.map((e, idx) => idx === i ? { ...e, [field]: value } : e) }));
  };
  const removeExperience = (i: number) => {
    setData((prev) => ({ ...prev, experiences: prev.experiences.filter((_, idx) => idx !== i) }));
  };

  const addProject = () => {
    setData((prev) => ({ ...prev, projects: [...prev.projects, { title: '', description: '' }] }));
  };
  const updateProject = (i: number, field: 'title' | 'description', value: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p) }));
  };
  const removeProject = (i: number) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }));
  };

  const applyAI = () => {
    setGenerating(true);
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        objective: improveText(generateObjective(prev.profession, prev.employmentType)),
        about: improveAbout(prev.about, prev.profession, prev.employmentType),
        skills: prev.skills.map((s) => improveText(s)),
        experiences: prev.experiences.map((e) => ({
          ...e,
          title: improveText(e.title),
          description: improveText(e.description),
        })),
        projects: prev.projects.map((p) => ({
          ...p,
          title: improveText(p.title),
          description: improveText(p.description),
        })),
        courses: prev.courses.map((c) => ({
          ...c,
          title: improveText(c.title),
          institution: improveText(c.institution),
        })),
      }));
      setGenerating(false);
    }, 1200);
  };

  const generatePDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(generateResumeHTML(data));
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  const canProceed = data.fullName.trim() && data.profession.trim();

  if (step === 'review') {
    return (
      <div className="resume-builder">
        <div className="resume-builder-header">
          <button className="back-btn" onClick={() => setStep('form')}>
            <ArrowLeft size={16} /> Voltar e editar
          </button>
          <h2>Revise seu currículo</h2>
          <p>Confira todas as informações abaixo. Se precisar ajustar algo, volte e edite. Quando estiver pronto, gere o PDF.</p>
        </div>

        <div className="resume-preview">
          <div className="resume-preview-section">
            <h3 className="resume-preview-name">{data.fullName || 'Seu nome'}</h3>
            <div className="resume-preview-contact">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>{data.phone}</span>}
              {data.city && <span>{data.city}</span>}
            </div>
          </div>

          {data.objective && (
            <div className="resume-preview-section">
              <span className="resume-preview-label">Objetivo</span>
              <p>{data.objective}</p>
            </div>
          )}
          {data.about && (
            <div className="resume-preview-section">
              <span className="resume-preview-label">Resumo</span>
              <p>{data.about}</p>
            </div>
          )}

          <div className="resume-preview-section">
            <span className="resume-preview-label">Formação</span>
            <p>{data.education}{data.institution ? ` — ${data.institution}` : ''}{data.educationStatus ? ` (${data.educationStatus})` : ''}</p>
          </div>

          {data.skills.length > 0 && (
            <div className="resume-preview-section">
              <span className="resume-preview-label">Habilidades</span>
              <div className="resume-preview-tags">
                {data.skills.map((s, i) => <span key={i} className="resume-preview-tag">{s}</span>)}
              </div>
            </div>
          )}

          {data.experiences.length > 0 && (
            <div className="resume-preview-section">
              <span className="resume-preview-label">Experiências</span>
              {data.experiences.map((e, i) => (
                <div key={i} className="resume-preview-item">
                  <strong>{e.title}</strong>{e.company && <span> · {e.company}</span>}
                  {e.period && <em>{e.period}</em>}
                  {e.description && <p>{e.description}</p>}
                </div>
              ))}
            </div>
          )}

          {data.courses.length > 0 && (
            <div className="resume-preview-section">
              <span className="resume-preview-label">Cursos e Certificações</span>
              {data.courses.map((c, i) => (
                <div key={i} className="resume-preview-item">
                  <strong>{c.title}</strong>{c.institution && <span> · {c.institution}</span>}
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="resume-preview-section">
              <span className="resume-preview-label">Projetos e Atividades</span>
              {data.projects.map((p, i) => (
                <div key={i} className="resume-preview-item">
                  <strong>{p.title}</strong>
                  {p.description && <p>{p.description}</p>}
                </div>
              ))}
            </div>
          )}

          {data.languages.length > 0 && (
            <div className="resume-preview-section">
              <span className="resume-preview-label">Idiomas</span>
              <div className="resume-preview-tags">
                {data.languages.map((l, i) => <span key={i} className="resume-preview-tag">{l}</span>)}
              </div>
            </div>
          )}
        </div>

        <div className="resume-builder-footer">
          <button className="button button-ghost" onClick={() => setStep('form')}>
            <Pencil size={15} /> Editar
          </button>
          <button className="button button-blue" onClick={generatePDF}>
            <Download size={16} /> Gerar e baixar PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-builder">
      <div className="resume-builder-header">
        <span className="section-kicker">Construtor de Currículo com IA</span>
        <h2>Monte seu currículo personalizado</h2>
        <p>Preencha suas informações e a IA vai corrigir gramática, melhorar a escrita e adaptar o currículo para o tipo de vaga que você busca. Nada é inventado — usamos apenas o que você informar.</p>
      </div>

      <div className="resume-form">
        {/* Personal info */}
        <div className="resume-form-section">
          <h3>Dados pessoais</h3>
          <div className="resume-form-grid-2">
            <div className="filter-group">
              <label>Nome completo *</label>
              <input className="form-input" value={data.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Seu nome" />
            </div>
            <div className="filter-group">
              <label>E-mail</label>
              <input className="form-input" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="seu@email.com" />
            </div>
            <div className="filter-group">
              <label>Telefone</label>
              <input className="form-input" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="filter-group">
              <label>Cidade</label>
              <input className="form-input" value={data.city} onChange={(e) => update('city', e.target.value)} placeholder="São Paulo, SP" />
            </div>
          </div>
        </div>

        {/* Career goal */}
        <div className="resume-form-section">
          <h3>Objetivo profissional</h3>
          <div className="resume-form-grid-2">
            <div className="filter-group">
              <label>Profissão ou área desejada *</label>
              <input className="form-input" value={data.profession} onChange={(e) => update('profession', e.target.value)} placeholder="Ex: Marketing, TI, RH, Administração..." />
            </div>
            <div className="filter-group">
              <label>Tipo de vaga</label>
              <select className="form-select" value={data.employmentType} onChange={(e) => update('employmentType', e.target.value)}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="filter-group">
            <label>Objetivo profissional</label>
            <textarea className="form-textarea" rows={2} value={data.objective} onChange={(e) => update('objective', e.target.value)} placeholder="A IA pode gerar este campo automaticamente — clique em 'Aplicar IA' abaixo." />
          </div>
          <div className="filter-group">
            <label>Resumo / Sobre você</label>
            <textarea className="form-textarea" rows={3} value={data.about} onChange={(e) => update('about', e.target.value)} placeholder="Conte um pouco sobre você, seus interesses e o que busca..." />
          </div>
        </div>

        {/* Education */}
        <div className="resume-form-section">
          <h3>Formação</h3>
          <div className="resume-form-grid-2">
            <div className="filter-group">
              <label>Escolaridade</label>
              <input className="form-input" value={data.education} onChange={(e) => update('education', e.target.value)} placeholder="Ex: Ensino Médio, Cursando Superior..." />
            </div>
            <div className="filter-group">
              <label>Instituição</label>
              <input className="form-input" value={data.institution} onChange={(e) => update('institution', e.target.value)} placeholder="Escola / Faculdade" />
            </div>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select className="form-select" value={data.educationStatus} onChange={(e) => update('educationStatus', e.target.value)}>
              <option value="Cursando">Cursando</option>
              <option value="Completo">Completo</option>
              <option value="Previsto para">Previsão de conclusão</option>
            </select>
          </div>
        </div>

        {/* Skills */}
        <div className="resume-form-section">
          <h3>Habilidades</h3>
          <div className="skills-tags">
            {data.skills.map((s, i) => (
              <span key={i} className="skill-tag">
                {s}
                <button onClick={() => removeSkill(i)}><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="profile-add-inline">
            <input className="form-input" placeholder="Adicionar habilidade..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button className="button button-ghost button-small" onClick={addSkill} disabled={!skillInput.trim()}><Plus size={14} /> Adicionar</button>
          </div>
        </div>

        {/* Experiences */}
        <div className="resume-form-section">
          <div className="resume-form-section-header">
            <h3>Experiências profissionais</h3>
            <button className="button button-ghost button-small" onClick={addExperience}><Plus size={14} /> Adicionar</button>
          </div>
          <p className="resume-form-hint">Sem experiência? Pule esta seção e destaque seus projetos e atividades abaixo.</p>
          {data.experiences.map((e, i) => (
            <div key={i} className="resume-form-entry">
              <div className="resume-form-entry-header">
                <span>Experiência {i + 1}</span>
                <button onClick={() => removeExperience(i)} className="profile-item-delete"><Trash2 size={14} /></button>
              </div>
              <div className="resume-form-grid-2">
                <input className="form-input" placeholder="Cargo" value={e.title} onChange={(ev) => updateExperience(i, 'title', ev.target.value)} />
                <input className="form-input" placeholder="Empresa" value={e.company} onChange={(ev) => updateExperience(i, 'company', ev.target.value)} />
              </div>
              <input className="form-input" placeholder="Período (ex: 01/2025 — 06/2025)" value={e.period} onChange={(ev) => updateExperience(i, 'period', ev.target.value)} />
              <textarea className="form-textarea" rows={2} placeholder="Descrição das atividades..." value={e.description} onChange={(ev) => updateExperience(i, 'description', ev.target.value)} />
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="resume-form-section">
          <div className="resume-form-section-header">
            <h3>Cursos e certificações</h3>
            <button className="button button-ghost button-small" onClick={addCourse}><Plus size={14} /> Adicionar</button>
          </div>
          {data.courses.map((c, i) => (
            <div key={i} className="resume-form-entry">
              <div className="resume-form-entry-header">
                <span>Curso {i + 1}</span>
                <button onClick={() => removeCourse(i)} className="profile-item-delete"><Trash2 size={14} /></button>
              </div>
              <div className="resume-form-grid-2">
                <input className="form-input" placeholder="Título do curso" value={c.title} onChange={(ev) => updateCourse(i, 'title', ev.target.value)} />
                <input className="form-input" placeholder="Instituição" value={c.institution} onChange={(ev) => updateCourse(i, 'institution', ev.target.value)} />
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="resume-form-section">
          <div className="resume-form-section-header">
            <h3>Projetos e atividades</h3>
            <button className="button button-ghost button-small" onClick={addProject}><Plus size={14} /> Adicionar</button>
          </div>
          <p className="resume-form-hint">Sem experiência de trabalho? Use esta seção para destacar projetos escolares, voluntariado, atividades extracurriculares e iniciativas pessoais.</p>
          {data.projects.map((p, i) => (
            <div key={i} className="resume-form-entry">
              <div className="resume-form-entry-header">
                <span>Projeto {i + 1}</span>
                <button onClick={() => removeProject(i)} className="profile-item-delete"><Trash2 size={14} /></button>
              </div>
              <input className="form-input" placeholder="Título do projeto" value={p.title} onChange={(ev) => updateProject(i, 'title', ev.target.value)} />
              <textarea className="form-textarea" rows={2} placeholder="Descrição do projeto..." value={p.description} onChange={(ev) => updateProject(i, 'description', ev.target.value)} />
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="resume-form-section">
          <h3>Idiomas</h3>
          <div className="skills-tags">
            {data.languages.map((l, i) => (
              <span key={i} className="skill-tag">
                {l}
                <button onClick={() => removeLang(i)}><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="profile-add-inline">
            <input className="form-input" placeholder="Adicionar idioma (ex: Inglês — Intermediário)" value={langInput} onChange={(e) => setLangInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLang(); } }} />
            <button className="button button-ghost button-small" onClick={addLang} disabled={!langInput.trim()}><Plus size={14} /> Adicionar</button>
          </div>
        </div>

        {/* Actions */}
        <div className="resume-form-actions">
          <button className="button button-ghost" onClick={applyAI} disabled={generating}>
            <Sparkles size={16} /> {generating ? 'Aplicando IA...' : 'Aplicar IA: corrigir e melhorar'}
          </button>
          <button className="button button-blue" onClick={() => setStep('review')} disabled={!canProceed}>
            Revisar currículo <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Sou a First Step IA, sua assistente de carreira. Estou aqui para te ajudar com currículos, entrevistas, primeiro emprego, estágios, carreira, estudos, organização e desenvolvimento profissional. Sobre o que você quer conversar?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<'chat' | 'builder'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      <PageHero kicker="Inteligência Artificial" title={<>First Step <span className="text-blue-450">IA.</span></>}
        subtitle="Sua assistente de carreira com inteligência artificial. Tire dúvidas sobre currículos, entrevistas, primeiro emprego, estágios, carreira, estudos, organização e desenvolvimento profissional. Ou use o Construtor de Currículo com IA." />

      <section className="section page-section">
        <div className="container">
          {/* Mode toggle */}
          <div className="ai-mode-toggle">
            <button className={mode === 'chat' ? 'active' : ''} onClick={() => setMode('chat')}>
              <MessageCircle size={16} /> Assistente de carreira
            </button>
            <button className={mode === 'builder' ? 'active' : ''} onClick={() => setMode('builder')}>
              <FileText size={16} /> Construtor de Currículo com IA
            </button>
          </div>

          {mode === 'builder' ? (
            <ResumeBuilder />
          ) : (
            <>
              <div className="ai-topics-grid">
                {Object.entries(TOPIC_ICONS).map(([topic, Icon]) => (
                  <button key={topic} className="ai-topic-card" onClick={() => sendMessage(`Me ajude com ${topic.toLowerCase()}`)}>
                    <div className="ai-topic-icon"><Icon size={18} /></div>
                    <span>{topic}</span>
                  </button>
                ))}
              </div>
              <div className="ai-chat-container">
                <div className="ai-chat-header">
                  <div className="ai-chat-avatar"><img src="/logo.png" alt="First Step IA" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} /></div>
                  <div><strong>First Step IA</strong><span>Assistente de carreira</span></div>
                  <span className="ai-status"><span className="ai-status-dot" /> Online</span>
                </div>
                <div className="ai-chat-messages" ref={scrollRef}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`ai-message ${msg.role}`}>
                      {msg.role === 'assistant' && <div className="ai-message-avatar"><img src="/logo.png" alt="IA" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} /></div>}
                      <div className="ai-message-bubble" style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                      {msg.role === 'user' && <div className="ai-message-avatar user"><User size={16} /></div>}
                    </div>
                  ))}
                  {typing && (
                    <div className="ai-message assistant">
                      <div className="ai-message-avatar"><img src="/logo.png" alt="IA" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} /></div>
                      <div className="ai-typing"><span /><span /><span /></div>
                    </div>
                  )}
                </div>
                {messages.length <= 1 && (
                  <div className="ai-suggestions">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button key={prompt} className="ai-suggestion-chip" onClick={() => sendMessage(prompt)}>{prompt}</button>
                    ))}
                  </div>
                )}
                <div className="ai-chat-input">
                  <input type="text" placeholder="Pergunte sobre currículo, entrevistas, estágios..." value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} />
                  <button className="button button-blue button-small" onClick={() => sendMessage(input)} disabled={!input.trim()}><Send size={15} /></button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
