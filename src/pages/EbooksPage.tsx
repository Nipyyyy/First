import { useEffect, useState } from 'react';
import { BookOpen, Download, FileText, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase, type Ebook } from '@/lib/supabase';
import { PageHero } from '@/components/Layout';

const PLACEHOLDER_EBOOK = {
  id: 'featured',
  title: 'Guia do Primeiro Emprego',
  description: 'Tudo o que você precisa saber para conseguir seu primeiro emprego: currículo, entrevistas e postura profissional.',
  cover_url: null as string | null,
  file_url: null as string | null,
  sort_order: 0,
};

const EBOOK_CONTENT = {
  chapters: [
    {
      title: 'Capítulo 1 — Preparação mental',
      paragraphs: [
        'O primeiro emprego é um marco. Antes de enviar qualquer currículo, entenda que começar do zero é normal — ninguém nasce com experiência. O que diferencia quem consegue é persistência e preparação.',
        'Defina claramente seu objetivo. "Quero um emprego" é vago demais. Pense: "Quero uma vaga de jovem aprendiz na área administrativa em uma empresa perto de casa." Quanto mais específico, mais fácil traçar o caminho.',
        'Organize sua rotina. Separe um tempo do dia para buscar vagas, preparar currículo e treinar entrevistas. Trate a busca por emprego como um trabalho em si.',
      ],
    },
    {
      title: 'Capítulo 2 — O currículo perfeito para iniciantes',
      paragraphs: [
        'Seu currículo não precisa de experiência profissional para ser bom. O que importa é mostrar quem você é, o que sabe e o que quer aprender.',
        'Inclua: dados de contato, objetivo claro, escolaridade, cursos complementares, habilidades e atividades voluntárias. Mesmo ajudar na loja da família conta como experiência.',
        'Mantenha o currículo em uma página. Use fonte legível, layout limpo e sem erros de português. Peça para alguém revisar antes de enviar.',
        'Adapte o currículo para cada vaga. Se a empresa pede "boa comunicação", destaque experiências onde você usou comunicação — mesmo que seja em projetos da escola.',
      ],
    },
    {
      title: 'Capítulo 3 — Entrevistas sem medo',
      paragraphs: [
        'A entrevista é uma conversa, não um interrogatório. O recrutador quer conhecer você e ver se encaixa na vaga — não testar seu nível de nervosismo.',
        'Pesquise sobre a empresa antes. Saiba o que fazem, há quanto tempo existem e quais valores declaram. Isso mostra interesse e preparação.',
        'Treine as perguntas mais comuns: "Fale sobre você", "Por que quer trabalhar aqui?", "Quais são seus pontos fortes e fracos?". Pratique em voz alta — ajuda a organizar as ideias.',
        'No dia, chegue pontualmente, vista-se adequadamente para o ambiente da empresa e mantenha contato visual. Desligue o celular antes de entrar.',
      ],
    },
    {
      title: 'Capítulo 4 — Postura no primeiro emprego',
      paragraphs: [
        'Nos primeiros dias, observe mais do que fale. Entenda como a equipe funciona, quem é quem e quais são as expectativas sobre seu cargo.',
        'Não tenha medo de perguntar. É melhor fazer uma pergunta do que cometer um erro por não ter entendido. Anote as respostas para não repetir.',
        'Cumpra horários, seja organizado e trate todos com respeito — do faxineiro ao gerente. Reputação se constrói nos pequenos detalhes.',
        'Aceite feedback sem levar para o lado pessoal. Críticas construtivas são oportunidades de crescer dentro da empresa.',
      ],
    },
    {
      title: 'Capítulo 5 — Seus direitos',
      paragraphs: [
        'Conheça seus direitos trabalhistas: salário mínimo, 13º, férias, vale-transporte e INSS. Para aprendizes e estagiários, as regras são diferentes — informe-se.',
        'Guarda todos os documentos do contrato. Leia antes de assinar e não aceite condições abaixo da lei.',
        'Se algo parecer errado, procure ajuda. O sindicato da categoria e a Defensoria Pública podem orientar gratuitamente.',
      ],
    },
  ],
};

export function EbooksPage() {
  const [ebook, setEbook] = useState<Ebook | typeof PLACEHOLDER_EBOOK | null>(null);
  const [loading, setLoading] = useState(true);
  const [reading, setReading] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    const fetchEbook = async () => {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('sort_order')
        .limit(1)
        .maybeSingle();
      if (!error && data) setEbook(data as Ebook);
      else setEbook(PLACEHOLDER_EBOOK);
      setLoading(false);
    };
    fetchEbook();
  }, []);

  const handleDownloadPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const chapters = EBOOK_CONTENT.chapters
      .map(
        (ch) => `<section style="margin-bottom:48px"><h2 style="font-size:20px;color:#3b82f6;margin-bottom:16px">${ch.title}</h2>${ch.paragraphs.map((p) => `<p style="line-height:1.8;margin-bottom:14px;color:#cbd5e1">${p}</p>`).join('')}</section>`
      )
      .join('');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${ebook?.title || 'E-book'}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0e1a;font-family:'Georgia',serif;padding:60px 40px;max-width:720px;margin:0 auto}h1{font-size:36px;color:#fff;margin-bottom:8px}h1+p{color:#94a3b8;font-size:16px;margin-bottom:40px}@media print{body{background:#fff;padding:20px}h1{color:#111}h1+p{color:#555}}</style></head><body><h1>${ebook?.title || 'E-book'}</h1><p>${ebook?.description || ''}</p>${chapters}<script>window.onload=function(){window.print()}</script></body></html>`);
    win.document.close();
  };

  const chapter = EBOOK_CONTENT.chapters[currentChapter];
  const isFirst = currentChapter === 0;
  const isLast = currentChapter === EBOOK_CONTENT.chapters.length - 1;

  return (
    <>
      <PageHero
        kicker="Biblioteca First Step"
        title={<>E-book em <span className="text-blue-450">destaque.</span></>}
        subtitle="Materiais gratuitos produzidos pela nossa equipe para acelerar sua jornada profissional."
      />

      <section className="section page-section">
        <div className="container">
          {loading ? (
            <p className="empty-state">Carregando e-book...</p>
          ) : ebook ? (
            <div className="featured-ebook">
              <div className="featured-ebook-cover">
                {ebook.cover_url ? (
                  <img src={ebook.cover_url} alt={ebook.title} />
                ) : (
                  <div className="featured-ebook-cover-placeholder">
                    <BookOpen size={64} />
                    <span>E-book First Step</span>
                  </div>
                )}
              </div>
              <div className="featured-ebook-details">
                <span className="post-category">E-book gratuito</span>
                <h2>{ebook.title}</h2>
                <p>{ebook.description}</p>
                <div className="featured-ebook-meta">
                  <span><FileText size={15} /> {EBOOK_CONTENT.chapters.length} capítulos</span>
                  <span>Leitura estimada: 15 min</span>
                </div>
                <div className="featured-ebook-actions">
                  <button className="button button-blue" onClick={() => { setReading(true); setCurrentChapter(0); }}>
                    <FileText size={16} /> Ler no site
                  </button>
                  <button className="button button-ghost" onClick={handleDownloadPDF}>
                    <Download size={16} /> Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {reading && (
        <div className="ebook-reader-overlay" onClick={() => setReading(false)}>
          <div className="ebook-reader" onClick={(e) => e.stopPropagation()}>
            <div className="ebook-reader-header">
              <button className="ebook-reader-close" onClick={() => setReading(false)} aria-label="Fechar leitor">
                <X size={20} />
              </button>
              <div className="ebook-reader-title">
                <span className="section-kicker">Lendo</span>
                <h3>{ebook?.title}</h3>
              </div>
            </div>
            <div className="ebook-reader-progress">
              <div className="ebook-reader-progress-bar" style={{ width: `${((currentChapter + 1) / EBOOK_CONTENT.chapters.length) * 100}%` }} />
            </div>
            <div className="ebook-reader-content">
              <span className="ebook-reader-chapter-num">Capítulo {currentChapter + 1} de {EBOOK_CONTENT.chapters.length}</span>
              <h2>{chapter.title}</h2>
              {chapter.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="ebook-reader-nav">
              <button
                className="button button-ghost button-small"
                disabled={isFirst}
                onClick={() => setCurrentChapter((c) => Math.max(0, c - 1))}
              >
                <ArrowLeft size={15} /> Anterior
              </button>
              <span className="ebook-reader-page">{currentChapter + 1} / {EBOOK_CONTENT.chapters.length}</span>
              <button
                className="button button-blue button-small"
                disabled={isLast}
                onClick={() => setCurrentChapter((c) => Math.min(EBOOK_CONTENT.chapters.length - 1, c + 1))}
              >
                Próximo <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
