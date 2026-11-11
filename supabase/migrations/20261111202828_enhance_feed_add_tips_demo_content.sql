/*
# Enhance social feed: images, comment replies, Dicas category, demo content

1. Modified Tables
- `social_posts`: added `image_url` (text, nullable) — optional image attached to a post.
  Added 'Dicas' to the category CHECK constraint. Added new post_types: 'celebration',
  'interview', 'tip' to support richer feed content. Added `is_demo` (boolean, default false)
  to clearly flag demonstration/fictional content vs real user-generated content.
- `social_comments`: added `parent_id` (uuid, nullable, self-referencing FK) — supports
  replies to comments (nested one level). Added `is_demo` (boolean, default false).

2. Security
- No changes to RLS policies. Existing anon+authenticated CRUD policies still apply.
- New columns are nullable / have defaults, so existing policies remain valid.
- No new tables created.

3. Demo Content
- Inserts demonstration posts across multiple categories (Para você, Estudos, Carreira,
  Vagas, Dicas) with varied post types (user, question, celebration, interview, tip, job,
  firststep). All demo rows have `is_demo = true` so the app can label them clearly.
- Inserts demonstration comments (including replies) on several demo posts.
- Does NOT delete or modify existing real posts.

4. Notes
- The category CHECK constraint is dropped and recreated to include 'Dicas'.
- The post_type CHECK constraint is dropped and recreated to include new types.
- Comment reply depth is managed in application logic (one level of nesting).
*/

-- === social_posts: add image_url, is_demo, expand constraints ===
ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

ALTER TABLE social_posts DROP CONSTRAINT IF EXISTS social_posts_category_check;
ALTER TABLE social_posts ADD CONSTRAINT social_posts_category_check
  CHECK (category IN ('Para você','Notícias','Vagas','Estudos','Carreira','Cursos','Dicas'));

ALTER TABLE social_posts DROP CONSTRAINT IF EXISTS social_posts_post_type_check;
ALTER TABLE social_posts ADD CONSTRAINT social_posts_post_type_check
  CHECK (post_type IN ('user','question','job','news','firststep','celebration','interview','tip'));

-- === social_comments: add parent_id, is_demo ===
ALTER TABLE social_comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES social_comments(id) ON DELETE CASCADE;
ALTER TABLE social_comments ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_social_comments_parent_id ON social_comments(parent_id);

-- === Demo posts (is_demo = true) ===
-- These are clearly fictional demonstration content, not real user posts.

INSERT INTO social_posts (author_name, author_role, content, post_type, category, image_url, likes_count, comments_count, shares_count, saves_count, is_demo, created_at)
VALUES
  -- Celebration: got hired
  ('Lucas Almeida', 'Novo Jovem Aprendiz', 'CONSEGUI!! Começo segunda como Jovem Aprendiz no banco! Depois de 8 meses mandando currículo, entrevistas que achava que tinham ido mal e muita ansiedade... valeu cada tentativa. A quem está buscando: não desistem! 🎉', 'celebration', 'Para você', 'https://images.pexels.com/photos/7682459/pexels-photo-7682459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 234, 31, 18, 45, true, now() - interval '3 hours'),
  -- Interview experience
  ('Beatriz Lima', 'Estagiária de RH', 'Galera, fiz minha primeira entrevista presencial hoje e queria compartilhar como foi! Cheguei 20min antes, levei cópia do currículo, pesquisei sobre a empresa. Me perguntaram sobre um momento difícil que superei — usei um projeto da escola. Sentiram falta de ter exemplos reais pra contar. Dica: prepare 2-3 histórias suas antes de ir!', 'interview', 'Carreira', NULL, 156, 22, 12, 38, true, now() - interval '5 hours'),
  -- Question: internship opportunities
  ('Rafael Souza', 'Cursando Engenharia', 'Alguém sabe se já abriram inscrições para estágio nas grandes empresas pra 2027? Ou costuma abrir mais pro final do ano? Quero me organizar pra não perder prazo 😅', 'question', 'Estudos', NULL, 67, 19, 4, 12, true, now() - interval '7 hours'),
  -- First job discussion
  ('Camila Duarte', 'Primeiro Emprego', 'Meu primeiro emprego está sendo uma montanha-russa emocional rs. Um dia me sinto no controle, no outro acho que não sei de nada. Mas meus colegas dizem que é normal no começo. Como foi o primeiro mês de vocês?', 'user', 'Para você', NULL, 98, 27, 8, 21, true, now() - interval '9 hours'),
  -- Tips: resume improvement
  ('Prof. Carla Mendes', 'Orientadora de Carreira', '3 erros comuns no currículo de quem está começando:\n\n1. Usar fontes diferentes e coloridas — mantenha uma fonte só, preto e simples.\n2. Escrever "procuro oportunidade" sem especificar área — diga qual cargo quer.\n3. Listar hobbies irrelevantes — só inclua se conectar com a vaga.\n\nSeu currículo tem 6 segundos pra prender a atenção do recrutador. Faça cada linha valer!', 'tip', 'Dicas', NULL, 312, 41, 67, 89, true, now() - interval '11 hours'),
  -- Interview process discussion
  ('Thiago Nunes', 'Buscando Estágio', 'Fiz uma dinâmica de grupo na semana passada e fui eliminado. Fiquei chateado, mas percebi que falei pouco. Pra próxima, quero ser mais ativo sem parecer que quero dominar. Como vocês equilibraram isso?', 'question', 'Carreira', NULL, 54, 16, 3, 9, true, now() - interval '13 hours'),
  -- Workplace environment
  ('Jéssica Ramos', 'Aprendiz Administrativa', 'Dica pra quem vai começar: o ambiente de trabalho é MUITO diferente da escola. Você precisa aprender a hierarquia, como se comunicar por email, pedir ajuda sem parecer perdido demais. Não tenha vergonha de anotar tudo no começo, todo mundo entende!', 'tip', 'Dicas', 'https://images.pexels.com/photos/7654438/pexels-photo-7654438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 178, 24, 15, 52, true, now() - interval '15 hours'),
  -- Professional development
  ('Diego Martins', 'Desenvolvedor Júnior', 'Pessoal, descobri que soft skills importam MUITO mais do que eu achava. Entrei como júnior sabendo programar, mas o que me destacou foi saber comunicar, receber feedback sem levar pra lado pessoal e resolver conflitos com a equipe. Invistam nisso desde cedo!', 'user', 'Carreira', NULL, 201, 33, 22, 67, true, now() - interval '18 hours'),
  -- First job looking
  ('Sofia Carvalho', 'Buscando Primeiro Emprego', 'Tenho 17 anos, termino o ensino médio esse ano e quero muito conseguir meu primeiro emprego. Mas sinto que tudo pede experiência e eu não tenho nenhuma. Como vocês começaram? Aceito qualquer história de inspiração 🙏', 'user', 'Para você', NULL, 87, 29, 5, 18, true, now() - interval '21 hours'),
  -- Tips: selection process
  ('Equipe First Step', 'Equipe First Step', 'Processo seletivo em 5 etapas — entenda cada uma:\n\n1. Triagem de currículo\n2. Teste online (lógica, idioma ou técnico)\n3. Entrevista por vídeo\n4. Dinâmica de grupo\n5. Entrevista final com gestor\n\nSaber onde você está em cada etapa ajuda a não se perder. Boa sorte!', 'tip', 'Dicas', NULL, 278, 35, 48, 102, true, now() - interval '26 hours'),
  -- Job opportunity with image
  ('InovaTech', 'Recrutamento', 'VAGA: Estágio em Design Gráfico — Híbrido (São Paulo)\n\nProcuramos alguém cursando Design, Publicidade ou áreas criativas. Portfólio com projetos acadêmicos é bem-vindo! Bolsa-auxílio + plano de saúde + curso de UX gratuito.\n\nInscreva-se pelo link na bio.', 'job', 'Vagas', 'https://images.pexels.com/photos/7876895/pexels-photo-7876895.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 145, 21, 34, 56, true, now() - interval '30 hours'),
  -- Mentions with @
  ('Marina Costa', 'Estudante de Administração', '@Prof. Carla Mendes sua dica sobre currículo salvou minha vida! Refiz meu objetivo, deixei tudo numa fonte só e hoje me chamaram pra entrevista. Muito obrigada mesmo!! 🙏✨', 'user', 'Para você', NULL, 134, 18, 7, 23, true, now() - interval '34 hours'),
  -- Interview tips
  ('Beatriz Lima', 'Estagiária de RH', 'Perguntinha que sempre cai: "Por que você quer trabalhar aqui?"\n\nNUNCA respondam "porque preciso de dinheiro" 😅 Preparem algo sobre a empresa, sobre o que querem aprender e como vocês combinam com a vaga. Isso mostra interesse de verdade!', 'tip', 'Dicas', NULL, 189, 26, 31, 74, true, now() - interval '38 hours'),
  -- Studies discussion
  ('Pedro Henrique', 'Jovem Aprendiz', 'Update da minha dúvida de outro dia: decidi técnico em Informática! Falei com 3 pessoas da área e todas disseram que tem mais porta de entrada. Obrigado pelas dicas, comunidade! Vou começar as aulas mês que vem 🚀', 'user', 'Estudos', NULL, 76, 12, 4, 8, true, now() - interval '42 hours'),
  -- Professional development
  ('Ana Paula Ferreira', 'Recrutadora Sênior', 'Como recrutadora, o que mais me impressiona em candidatos jovens não é o que sabem — é a postura. Chegar pontual, olhar nos olhos, fazer perguntas inteligentes no final, mandar email agradecendo depois. São detalhes que colocam você na frente de muita gente.', 'tip', 'Dicas', NULL, 356, 47, 58, 134, true, now() - interval '46 hours');

-- === Demo comments and replies ===
-- We need to fetch demo post IDs to attach comments. Use a CTE approach.

DO $$
DECLARE
  p_celebration uuid;
  p_interview uuid;
  p_question uuid;
  p_firstjob uuid;
  p_resume uuid;
  p_mention uuid;
  c_top uuid;
  c_reply uuid;
BEGIN
  -- Celebration post (Lucas)
  SELECT id INTO p_celebration FROM social_posts WHERE author_name = 'Lucas Almeida' AND is_demo = true LIMIT 1;
  IF p_celebration IS NOT NULL THEN
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_celebration, 'Júlia Santos', 'Parabéns!! Que felicidade, você mereceu demais 🎉', true, now() - interval '2 hours')
    RETURNING id INTO c_top;
    INSERT INTO social_comments (post_id, parent_id, author_name, content, is_demo, created_at)
    VALUES (p_celebration, c_top, 'Lucas Almeida', 'Muito obrigada gente!! 🥹❤️', true, now() - interval '1.5 hours');

    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_celebration, 'Diego Martins', 'Que inspiração! Começo a buscar o meu agora, posts assim dão animo demais', true, now() - interval '1 hour');
  END IF;

  -- Interview experience post (Beatriz)
  SELECT id INTO p_interview FROM social_posts WHERE author_name = 'Beatriz Lima' AND post_type = 'interview' AND is_demo = true LIMIT 1;
  IF p_interview IS NOT NULL THEN
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_interview, 'Ana Paula Ferreira', 'Excelente relato! Levar cópias impressas do currículo é um diferencial que muitos esquecem. Parabéns pela iniciativa!', true, now() - interval '4 hours')
    RETURNING id INTO c_top;
    INSERT INTO social_comments (post_id, parent_id, author_name, content, is_demo, created_at)
    VALUES (p_interview, c_top, 'Beatriz Lima', 'Muito obrigada! Foi a melhor dica que me deram antes de ir 😊', true, now() - interval '3.5 hours');

    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_interview, 'Thiago Nunes', 'A parte de preparar histórias antes é tudo. Vou fazer isso na minha próxima entrevista com certeza', true, now() - interval '3 hours');
  END IF;

  -- Question about internships (Rafael)
  SELECT id INTO p_question FROM social_posts WHERE author_name = 'Rafael Souza' AND is_demo = true LIMIT 1;
  IF p_question IS NOT NULL THEN
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_question, 'Camila Duarte', 'Normalmente as grandes abrem entre agosto e outubro! Fica de olho nos sites das empresas e no LinkedIn', true, now() - interval '6 hours')
    RETURNING id INTO c_top;
    INSERT INTO social_comments (post_id, parent_id, author_name, content, is_demo, created_at)
    VALUES (p_question, c_top, 'Rafael Souza', 'Perfeito, obrigado! Vou configurar alertas pra não perder', true, now() - interval '5.5 hours');

    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_question, 'Equipe First Step', 'No First Step também postamos vagas de estágio assim que abrem! Fiquem de olho na aba Vagas 👀', true, now() - interval '5 hours');
  END IF;

  -- First job discussion (Camila)
  SELECT id INTO p_firstjob FROM social_posts WHERE author_name = 'Camila Duarte' AND is_demo = true LIMIT 1;
  IF p_firstjob IS NOT NULL THEN
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_firstjob, 'Jéssica Ramos', 'O primeiro mês é exatamente assim! No segundo você já pega o ritmo, prometo. Anote tudo, pergunte sem medo 📝', true, now() - interval '8 hours');
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_firstjob, 'Amanda Rocha', 'Me senti igual! Depois de 2 meses comecei a entender as coisas. Força, você consegue!', true, now() - interval '7 hours');
  END IF;

  -- Resume tips post (Prof. Carla)
  SELECT id INTO p_resume FROM social_posts WHERE author_name = 'Prof. Carla Mendes' AND post_type = 'tip' AND is_demo = true LIMIT 1;
  IF p_resume IS NOT NULL THEN
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_resume, 'Júlia Santos', 'Essa dica do objetivo específico mudou tudo pra mim! Escrevi "Estágio em Marketing Digital" em vez de "procuro oportunidade" e me chamaram rápido', true, now() - interval '10 hours')
    RETURNING id INTO c_top;
    INSERT INTO social_comments (post_id, parent_id, author_name, content, is_demo, created_at)
    VALUES (p_resume, c_top, 'Prof. Carla Mendes', 'Isso mesmo, Júlia! Especificar é metade do caminho. Parabéns pela atitude 🚀', true, now() - interval '9.5 hours');

    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_resume, 'Sofia Carvalho', 'Vou refazer meu currículo agora mesmo seguindo essas dicas! Obrigada por compartilhar conhecimento 💙', true, now() - interval '9 hours');
  END IF;

  -- Mention post (Marina thanking Carla)
  SELECT id INTO p_mention FROM social_posts WHERE author_name = 'Marina Costa' AND is_demo = true LIMIT 1;
  IF p_mention IS NOT NULL THEN
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_mention, 'Prof. Carla Mendes', 'Ai que felicidade saber disso, Marina! Você fez a parte difícil, eu só apontei o caminho. Muita sorte nessa entrevista! 💪', true, now() - interval '33 hours');
    INSERT INTO social_comments (post_id, author_name, content, is_demo, created_at)
    VALUES (p_mention, 'Caio Ferreira', 'Que história legal! Mostra que pequenos ajustes fazem diferença enorme', true, now() - interval '32 hours');
  END IF;
END $$;
