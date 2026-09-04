import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Briefcase,
  Bot,
  Calendar,
  FileText,
  GraduationCap,
  MessageCircle,
  Send,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import { PageHero } from '@/components/Layout';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const TOPIC_ICONS: Record<string, typeof FileText> = {
  Currículos: FileText,
  Entrevistas: MessageCircle,
  'Primeiro emprego': Briefcase,
  Estágios: GraduationCap,
  Carreira: TrendingUp,
  Estudos: BookOpen,
  Organização: Calendar,
  'Desenvolvimento profissional': Sparkles,
};

const SUGGESTED_PROMPTS = [
  'Como montar um currículo sem experiência?',
  'O que dizer em uma entrevista de estágio?',
  'Como conseguir meu primeiro emprego?',
  'Quais habilidades devo desenvolver?',
];

const AI_RESPONSES: Record<string, string> = {
  currículo: 'Para montar um currículo sem experiência, comece destacando suas habilidades, cursos, projetos e voluntariado. Use um modelo limpo, coloque seus dados de contato no topo, um resumo curto sobre você, sua escolaridade e qualquer atividade que mostre suas qualidades. Recrutadores valorizam iniciativa e vontade de aprender!',
  entrevista: 'Em uma entrevista de estágio, seja você mesmo. Pesquise sobre a empresa, prepare respostas para perguntas comuns (pontos fortes, fracos, por que quer o estágio), vista-se adequadamente e mostre vontade de aprender. Faça perguntas ao recrutador — isso demonstra interesse. Controle a ansiedade e mantenha contato visual.',
  'primeiro emprego': 'Para conseguir seu primeiro emprego: 1) Monte um currículo honesto e bem estruturado. 2) Busque vagas em plataformas como First Step, Gupy e LinkedIn. 3) Considere programas de jovem aprendiz. 4) Faça cursos gratuitos para enriquecer o currículo. 5) Pratique para entrevistas. 6) Não desista — persistência é fundamental!',
  estágio: 'Para conseguir um estágio, busque plataformas especializadas, verifique os requisitos (cursando ensino superior ou técnico), prepare seu currículo destacando projetos acadêmicos e participe de processos seletivos. Muitas empresas valorizam mais a atitude e vontade de aprender do que experiência prévia.',
  carreira: 'Para desenvolver sua carreira, defina seus objetivos, busque constantemente aprender, faça networking, participe de eventos e cursos, e não tenha medo de começar de baixo. O importante é dar o primeiro passo e construir gradualmente. Soft skills como comunicação e adaptabilidade são tão importantes quanto habilidades técnicas.',
  estudo: 'Para estudar de forma eficaz, crie uma rotina com horários fixos, use técnicas como Pomodoro, faça resumos e mapas mentais, pratique com exercícios, e não deixe para a última hora. Organize seu material e ambiente de estudo. Descanso também faz parte do processo!',
  organização: 'Para se organizar melhor, use ferramentas como Google Calendar ou Notion, divida tarefas grandes em pequenas, priorize por urgência e importância, estabeleça metas semanais e revise seu progresso. O método GTD (Getting Things Done) é ótimo para começar.',
  desenvolvimento: 'Para seu desenvolvimento profissional, invista em aprendizado contínuo (cursos, livros, vídeos), busque feedback, desenvolva inteligência emocional, aprenda a trabalhar em equipe, e mantenha-se atualizado sobre tendências da sua área. Networking e mentoria também aceleram seu crescimento.',
  habilidade: 'As habilidades mais valorizadas pelo mercado incluem: comunicação, pensamento crítico, adaptabilidade, trabalho em equipe, proatividade, inteligência emocional, e habilidades digitais básicas. Invista em cursos gratuitos do Google, SENAC e Fundação Bradesco para desenvolver essas competências.',
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('currículo') || lower.includes('curriculo')) return AI_RESPONSES.currículo;
  if (lower.includes('entrevista')) return AI_RESPONSES.entrevista;
  if (lower.includes('primeiro emprego') || lower.includes('primeiro trabalho')) return AI_RESPONSES['primeiro emprego'];
  if (lower.includes('estágio') || lower.includes('estagio')) return AI_RESPONSES.estágio;
  if (lower.includes('carreira') || lower.includes('profissão') || lower.includes('profissao')) return AI_RESPONSES.carreira;
  if (lower.includes('estud') || lower.includes('aprender')) return AI_RESPONSES.estudo;
  if (lower.includes('organiz') || lower.includes('produtiv')) return AI_RESPONSES.organização;
  if (lower.includes('desenvolv') || lower.includes('habilidade') || lower.includes('crescer')) return AI_RESPONSES.desenvolvimento;
  return 'Sou a First Step IA, aqui para ajudar com currículos, entrevistas, primeiro emprego, estágios, carreira, estudos, organização e desenvolvimento profissional. Pode me perguntar sobre qualquer um desses temas!';
}

export function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Sou a First Step IA, sua assistente de carreira. Posso te ajudar com currículos, entrevistas, primeiro emprego, estágios, carreira, estudos, organização e desenvolvimento profissional. Sobre o que você quer conversar?' },
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
    }, 800);
  };

  return (
    <>
      <PageHero
        kicker="Inteligência Artificial"
        title={<>First Step <span className="text-blue-450">IA.</span></>}
        subtitle="Sua assistente de carreira com inteligência artificial. Tire dúvidas sobre currículos, entrevistas, primeiro emprego, estágios, carreira, estudos, organização e desenvolvimento profissional."
      />

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
              <div className="ai-chat-avatar"><Bot size={20} /></div>
              <div>
                <strong>First Step IA</strong>
                <span>Assistente de carreira</span>
              </div>
              <span className="ai-status"><span className="ai-status-dot" /> Online</span>
            </div>

            <div className="ai-chat-messages" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`ai-message ${msg.role}`}>
                  {msg.role === 'assistant' && <div className="ai-message-avatar"><Bot size={16} /></div>}
                  <div className="ai-message-bubble">{msg.content}</div>
                  {msg.role === 'user' && <div className="ai-message-avatar user"><User size={16} /></div>}
                </div>
              ))}
              {typing && (
                <div className="ai-message assistant">
                  <div className="ai-message-avatar"><Bot size={16} /></div>
                  <div className="ai-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="ai-suggestions">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button key={prompt} className="ai-suggestion-chip" onClick={() => sendMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div className="ai-chat-input">
              <input
                type="text"
                placeholder="Pergunte sobre currículo, entrevistas, estágios..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              />
              <button className="button button-blue button-small" onClick={() => sendMessage(input)} disabled={!input.trim()}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
