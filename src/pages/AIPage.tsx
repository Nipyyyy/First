import { useEffect, useRef, useState } from 'react';
import {
  BookOpen, Briefcase, Bot, Calendar, FileText, GraduationCap,
  MessageCircle, Send, Sparkles, TrendingUp, User,
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

function getAIResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  if (lower.includes('currículo') || lower.includes('curriculo') || lower.includes('resume')) {
    return 'Montar um currículo sem experiência é mais fácil do que parece! Aqui vai um roteiro prático:\n\n1. Comece com seus dados de contato no topo (nome, telefone, e-mail, cidade).\n2. Escreva um resumo curto — 2 ou 3 linhas sobre quem você é e o que busca.\n3. Coloque sua escolaridade, mesmo que esteja cursando.\n4. Liste cursos que você fez, mesmo os gratuitos e online.\n5. Adicione projetos, voluntariado ou atividades da escola — isso mostra iniciativa.\n6. Inclua habilidades como comunicação, organização ou ferramentas que você usa.\n\nDica importante: mantenha tudo em uma página, com layout limpo e sem erros de português. Recrutadores valorizam muito mais vontade de aprender e organização do que experiência prévia. Quer que eu te ajude a escrever o resumo?';
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

export function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Sou a First Step IA, sua assistente de carreira. Estou aqui para te ajudar com currículos, entrevistas, primeiro emprego, estágios, carreira, estudos, organização e desenvolvimento profissional. Sobre o que você quer conversar?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
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
        subtitle="Sua assistente de carreira com inteligência artificial. Tire dúvidas sobre currículos, entrevistas, primeiro emprego, estágios, carreira, estudos, organização e desenvolvimento profissional." />
      <section className="section page-section">
        <div className="container">
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
        </div>
      </section>
    </>
  );
}
