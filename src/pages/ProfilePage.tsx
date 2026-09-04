import { useEffect, useState, useCallback } from 'react';
import {
  Award,
  BriefcaseBusiness,
  Camera,
  Check,
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Link2,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  supabase,
  type Profile,
  type ProfileSkill,
  type ProfileCertificate,
  type ProfileCourse,
  type ProfileExperience,
  type ProfileProject,
} from '@/lib/supabase';

const EDUCATION_LEVELS = ['Ensino Fundamental', 'Cursando Ensino Médio', 'Ensino Médio Completo', 'Cursando Ensino Superior', 'Ensino Superior Completo', 'Cursando Técnico', 'Técnico Completo'];
const PROFESSIONAL_STATUSES = ['Em busca de estágio', 'Em busca do primeiro emprego', 'Estagiário(a)', 'Aprendiz', 'Empregado(a)', 'Freelancer', 'Estudante'];

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<ProfileSkill[]>([]);
  const [certificates, setCertificates] = useState<ProfileCertificate[]>([]);
  const [courses, setCourses] = useState<ProfileCourse[]>([]);
  const [experiences, setExperiences] = useState<ProfileExperience[]>([]);
  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInfo, setEditingInfo] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at').limit(1).maybeSingle();
    if (!profiles) {
      const { data: newProfile } = await supabase.from('profiles').insert({}).select('*').single();
      if (newProfile) setProfile(newProfile as Profile);
    } else {
      setProfile(profiles as Profile);
      const pid = (profiles as Profile).id;
      const [sk, cert, cou, exp, prj] = await Promise.all([
        supabase.from('profile_skills').select('*').eq('profile_id', pid).order('sort_order'),
        supabase.from('profile_certificates').select('*').eq('profile_id', pid).order('created_at', { ascending: false }),
        supabase.from('profile_courses').select('*').eq('profile_id', pid),
        supabase.from('profile_experiences').select('*').eq('profile_id', pid),
        supabase.from('profile_projects').select('*').eq('profile_id', pid),
      ]);
      if (sk.data) setSkills(sk.data as ProfileSkill[]);
      if (cert.data) setCertificates(cert.data as ProfileCertificate[]);
      if (cou.data) setCourses(cou.data as ProfileCourse[]);
      if (exp.data) setExperiences(exp.data as ProfileExperience[]);
      if (prj.data) setProjects(prj.data as ProfileProject[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const { data } = await supabase.from('profiles').update(updates).eq('id', profile.id).select('*').single();
    if (data) setProfile(data as Profile);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!profile) return;
    const ext = file.name.split('.').pop();
    const fileName = `photo-${profile.id}.${ext}`;
    const { error } = await supabase.storage.from('certificates').upload(fileName, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
      updateProfile({ photo_url: urlData.publicUrl });
    }
  };

  // Skills
  const [skillInput, setSkillInput] = useState('');
  const addSkill = async () => {
    if (!profile || !skillInput.trim()) return;
    const { data } = await supabase.from('profile_skills').insert({ profile_id: profile.id, name: skillInput.trim(), sort_order: skills.length }).select('*').single();
    if (data) setSkills((prev) => [...prev, data as ProfileSkill]);
    setSkillInput('');
  };
  const removeSkill = async (id: string) => {
    await supabase.from('profile_skills').delete().eq('id', id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // Certificates
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploadingCert, setUploadingCert] = useState(false);

  const addCertificate = async () => {
    if (!profile || !certTitle.trim()) return;
    setUploadingCert(true);
    let fileUrl: string | null = null;
    let fileName: string | null = null;
    if (certFile) {
      const ext = certFile.name.split('.').pop();
      const filePath = `cert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('certificates').upload(filePath, certFile);
      if (!error) {
        const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
        fileName = certFile.name;
      }
    }
    const { data } = await supabase.from('profile_certificates').insert({ profile_id: profile.id, title: certTitle.trim(), issuer: certIssuer.trim(), file_url: fileUrl, file_name: fileName }).select('*').single();
    if (data) setCertificates((prev) => [data as ProfileCertificate, ...prev]);
    setCertTitle(''); setCertIssuer(''); setCertFile(null);
    setUploadingCert(false);
  };
  const removeCertificate = async (id: string) => {
    await supabase.from('profile_certificates').delete().eq('id', id);
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  // Courses
  const [courseTitle, setCourseTitle] = useState('');
  const [courseInst, setCourseInst] = useState('');
  const [courseDate, setCourseDate] = useState('');
  const addCourse = async () => {
    if (!profile || !courseTitle.trim()) return;
    const { data } = await supabase.from('profile_courses').insert({ profile_id: profile.id, title: courseTitle.trim(), institution: courseInst.trim(), completion_date: courseDate || null }).select('*').single();
    if (data) setCourses((prev) => [...prev, data as ProfileCourse]);
    setCourseTitle(''); setCourseInst(''); setCourseDate('');
  };
  const removeCourse = async (id: string) => {
    await supabase.from('profile_courses').delete().eq('id', id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Experiences
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const addExperience = async () => {
    if (!profile || !expTitle.trim()) return;
    const { data } = await supabase.from('profile_experiences').insert({ profile_id: profile.id, title: expTitle.trim(), company: expCompany.trim(), start_date: expStart || null, end_date: expEnd || null, description: expDesc.trim() }).select('*').single();
    if (data) setExperiences((prev) => [data as ProfileExperience, ...prev]);
    setExpTitle(''); setExpCompany(''); setExpStart(''); setExpEnd(''); setExpDesc('');
  };
  const removeExperience = async (id: string) => {
    await supabase.from('profile_experiences').delete().eq('id', id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  // Projects
  const [prjTitle, setPrjTitle] = useState('');
  const [prjDesc, setPrjDesc] = useState('');
  const [prjLink, setPrjLink] = useState('');
  const addProject = async () => {
    if (!profile || !prjTitle.trim()) return;
    const { data } = await supabase.from('profile_projects').insert({ profile_id: profile.id, title: prjTitle.trim(), description: prjDesc.trim(), link_url: prjLink || null }).select('*').single();
    if (data) setProjects((prev) => [...prev, data as ProfileProject]);
    setPrjTitle(''); setPrjDesc(''); setPrjLink('');
  };
  const removeProject = async (id: string) => {
    await supabase.from('profile_projects').delete().eq('id', id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const generateResumePDF = () => {
    if (!profile) return;
    const win = window.open('', '_blank');
    if (!win) return;
    const html = buildResumeHTML(profile, skills, certificates, courses, experiences, projects);
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  if (loading) {
    return (
      <section className="section page-section">
        <div className="container"><p className="empty-state">Carregando perfil...</p></div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="section page-section">
        <div className="container"><p className="empty-state">Não foi possível carregar o perfil.</p></div>
      </section>
    );
  }

  return (
    <section className="section page-section profile-page">
      <div className="container profile-container">
        {/* Profile header card */}
        <div className="profile-header-card">
          <div className="profile-banner" />
          <div className="profile-header-body">
            <div className="profile-photo-wrap">
              {profile.photo_url ? (
                <img src={profile.photo_url} alt={profile.name || 'Perfil'} className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder"><User size={36} /></div>
              )}
              <label className="profile-photo-edit" title="Alterar foto">
                <Camera size={15} />
                <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
              </label>
            </div>
            <div className="profile-header-info">
              <div className="profile-name-row">
                <div>
                  <h2>{profile.name || 'Seu nome'}</h2>
                  <span className="profile-username">@{profile.username || 'username'}</span>
                </div>
                <button className="button button-ghost button-small" onClick={() => setEditingInfo(!editingInfo)}>
                  <Pencil size={14} /> {editingInfo ? 'Concluir' : 'Editar perfil'}
                </button>
              </div>
              {profile.professional_status && <span className="profile-status">{profile.professional_status}</span>}
              <div className="profile-meta-row">
                {profile.location && <span><MapPin size={13} /> {profile.location}</span>}
                {profile.institution && <span><GraduationCap size={13} /> {profile.institution}</span>}
                {profile.interest_area && <span><BriefcaseBusiness size={13} /> {profile.interest_area}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Edit info form */}
        {editingInfo && (
          <div className="profile-edit-form">
            <h3>Editar informações</h3>
            <div className="profile-edit-grid">
              <div className="filter-group">
                <label>Nome</label>
                <input className="form-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Seu nome" />
              </div>
              <div className="filter-group">
                <label>@username</label>
                <input className="form-input" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="seunome" />
              </div>
              <div className="filter-group">
                <label>Localização</label>
                <input className="form-input" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Cidade, Estado" />
              </div>
              <div className="filter-group">
                <label>Escolaridade</label>
                <select className="form-select" value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })}>
                  <option value="">Selecione</option>
                  {EDUCATION_LEVELS.map((ed) => <option key={ed} value={ed}>{ed}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Instituição</label>
                <input className="form-input" value={profile.institution} onChange={(e) => setProfile({ ...profile, institution: e.target.value })} placeholder="Escola / Faculdade" />
              </div>
              <div className="filter-group">
                <label>Área de interesse</label>
                <input className="form-input" value={profile.interest_area} onChange={(e) => setProfile({ ...profile, interest_area: e.target.value })} placeholder="Ex: Marketing, TI, RH" />
              </div>
              <div className="filter-group">
                <label>Status profissional</label>
                <select className="form-select" value={profile.professional_status} onChange={(e) => setProfile({ ...profile, professional_status: e.target.value })}>
                  <option value="">Selecione</option>
                  {PROFESSIONAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="filter-group" style={{ marginTop: '12px' }}>
              <label>Sobre mim</label>
              <textarea className="form-textarea" rows={3} value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} placeholder="Conte um pouco sobre você..." />
            </div>
            <div className="form-actions">
              <button className="button button-blue button-small" onClick={() => { updateProfile({ name: profile.name, username: profile.username, location: profile.location, education: profile.education, institution: profile.institution, interest_area: profile.interest_area, professional_status: profile.professional_status, about: profile.about }); setEditingInfo(false); }}>
                <Check size={14} /> Salvar
              </button>
            </div>
          </div>
        )}

        {/* About */}
        {!editingInfo && profile.about && (
          <div className="profile-section">
            <div className="profile-section-header"><h3>Sobre</h3></div>
            <p className="profile-about-text">{profile.about}</p>
          </div>
        )}

        {/* Skills */}
        <div className="profile-section">
          <div className="profile-section-header"><h3>Habilidades</h3></div>
          <div className="skills-tags">
            {skills.map((s) => (
              <span key={s.id} className="skill-tag">
                {s.name}
                <button onClick={() => removeSkill(s.id)}><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="profile-add-inline">
            <input className="form-input" placeholder="Adicionar habilidade..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button className="button button-ghost button-small" onClick={addSkill} disabled={!skillInput.trim()}><Plus size={14} /> Adicionar</button>
          </div>
        </div>

        {/* Certificates */}
        <div className="profile-section">
          <div className="profile-section-header"><h3><Award size={16} /> Certificados</h3></div>
          <div className="cert-list">
            {certificates.map((c) => (
              <div key={c.id} className="cert-card">
                <div className="cert-icon"><FileText size={18} /></div>
                <div className="cert-info">
                  <strong>{c.title}</strong>
                  {c.issuer && <span>{c.issuer}</span>}
                </div>
                <div className="cert-actions">
                  {c.file_url && <a href={c.file_url} target="_blank" rel="noopener noreferrer" className="cert-link" title="Ver arquivo"><ExternalLink size={15} /></a>}
                  <button onClick={() => removeCertificate(c.id)} className="cert-delete" title="Remover"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="profile-add-form">
            <div className="profile-add-grid">
              <input className="form-input" placeholder="Título do certificado" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} />
              <input className="form-input" placeholder="Emissor (ex: Google, SENAC)" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} />
            </div>
            <div className="cert-file-row">
              <label className="cert-file-label">
                <FileText size={15} /> {certFile ? certFile.name : 'Anexar certificado (PNG, JPG ou PDF)'}
                <input type="file" accept="image/png,image/jpeg,application/pdf" hidden onChange={(e) => setCertFile(e.target.files?.[0] || null)} />
              </label>
              <button className="button button-blue button-small" onClick={addCertificate} disabled={uploadingCert || !certTitle.trim()}>
                <Plus size={14} /> {uploadingCert ? 'Enviando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="profile-section">
          <div className="profile-section-header"><h3><GraduationCap size={16} /> Cursos</h3></div>
          <div className="profile-items">
            {courses.map((c) => (
              <div key={c.id} className="profile-item-row">
                <div className="profile-item-icon"><GraduationCap size={16} /></div>
                <div className="profile-item-main">
                  <strong>{c.title}</strong>
                  <span>{c.institution}{c.completion_date ? ` · ${c.completion_date}` : ''}</span>
                </div>
                <button onClick={() => removeCourse(c.id)} className="profile-item-delete"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="profile-add-form">
            <div className="profile-add-grid-3">
              <input className="form-input" placeholder="Título do curso" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
              <input className="form-input" placeholder="Instituição" value={courseInst} onChange={(e) => setCourseInst(e.target.value)} />
              <input className="form-input" placeholder="Conclusão (ex: 2025-06)" value={courseDate} onChange={(e) => setCourseDate(e.target.value)} />
            </div>
            <button className="button button-ghost button-small" onClick={addCourse} disabled={!courseTitle.trim()}><Plus size={14} /> Adicionar curso</button>
          </div>
        </div>

        {/* Experiences */}
        <div className="profile-section">
          <div className="profile-section-header"><h3><BriefcaseBusiness size={16} /> Experiências</h3></div>
          <div className="profile-timeline">
            {experiences.map((e) => (
              <div key={e.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-top">
                    <strong>{e.title}</strong>
                    <button onClick={() => removeExperience(e.id)} className="profile-item-delete"><Trash2 size={14} /></button>
                  </div>
                  <span className="timeline-company">{e.company}</span>
                  <span className="timeline-date">{e.start_date}{e.end_date ? ` — ${e.end_date}` : ' — Atual'}</span>
                  {e.description && <p>{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="profile-add-form">
            <div className="profile-add-grid">
              <input className="form-input" placeholder="Cargo" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} />
              <input className="form-input" placeholder="Empresa" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} />
            </div>
            <div className="profile-add-grid">
              <input className="form-input" placeholder="Início (ex: 2025-03)" value={expStart} onChange={(e) => setExpStart(e.target.value)} />
              <input className="form-input" placeholder="Fim (vazio = atual)" value={expEnd} onChange={(e) => setExpEnd(e.target.value)} />
            </div>
            <textarea className="form-textarea" rows={2} placeholder="Descrição..." value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
            <button className="button button-ghost button-small" onClick={addExperience} disabled={!expTitle.trim()}><Plus size={14} /> Adicionar experiência</button>
          </div>
        </div>

        {/* Projects */}
        <div className="profile-section">
          <div className="profile-section-header"><h3><FolderGit2 size={16} /> Projetos</h3></div>
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.id} className="project-card">
                <div className="project-card-top">
                  <div className="profile-item-icon"><FolderGit2 size={16} /></div>
                  <button onClick={() => removeProject(p.id)} className="profile-item-delete"><Trash2 size={14} /></button>
                </div>
                <strong>{p.title}</strong>
                <p>{p.description}</p>
                {p.link_url && <a href={p.link_url} target="_blank" rel="noopener noreferrer" className="project-link"><Link2 size={13} /> Ver projeto</a>}
              </div>
            ))}
          </div>
          <div className="profile-add-form">
            <input className="form-input" placeholder="Título do projeto" value={prjTitle} onChange={(e) => setPrjTitle(e.target.value)} />
            <textarea className="form-textarea" rows={2} placeholder="Descrição do projeto..." value={prjDesc} onChange={(e) => setPrjDesc(e.target.value)} />
            <input className="form-input" placeholder="Link (opcional)" value={prjLink} onChange={(e) => setPrjLink(e.target.value)} />
            <button className="button button-ghost button-small" onClick={addProject} disabled={!prjTitle.trim()}><Plus size={14} /> Adicionar projeto</button>
          </div>
        </div>

        {/* Resume download */}
        <div className="profile-resume-cta">
          <div className="resume-cta-icon"><FileText size={24} /></div>
          <div>
            <strong>Gere seu currículo em PDF</strong>
            <p>Monte um currículo profissional com todos os dados do seu perfil e baixe em PDF.</p>
          </div>
          <button className="button button-blue" onClick={generateResumePDF}>
            <Download size={16} /> Gerar e baixar PDF
          </button>
        </div>
      </div>
    </section>
  );
}

function buildResumeHTML(
  profile: Profile,
  skills: ProfileSkill[],
  certificates: ProfileCertificate[],
  courses: ProfileCourse[],
  experiences: ProfileExperience[],
  projects: ProfileProject[],
): string {
  const skillList = skills.map((s) => s.name).join(' · ');
  const certList = certificates.map((c) => `<li><strong>${c.title}</strong>${c.issuer ? ` — ${c.issuer}` : ''}</li>`).join('');
  const courseList = courses.map((c) => `<li><strong>${c.title}</strong>${c.institution ? ` — ${c.institution}` : ''}${c.completion_date ? ` (${c.completion_date})` : ''}</li>`).join('');
  const expList = experiences.map((e) => `
    <div class="exp-item">
      <div class="exp-header"><strong>${e.title}</strong> <span>${e.company}</span></div>
      <div class="exp-date">${e.start_date || ''}${e.end_date ? ` — ${e.end_date}` : (e.start_date ? ' — Atual' : '')}</div>
      ${e.description ? `<p>${e.description}</p>` : ''}
    </div>`).join('');
  const prjList = projects.map((p) => `<li><strong>${p.title}</strong>${p.description ? `: ${p.description}` : ''}${p.link_url ? ` <a href="${p.link_url}">${p.link_url}</a>` : ''}</li>`).join('');

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Currículo - ${profile.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 48px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 28px; color: #0f172a; letter-spacing: -.02em; }
    .username { color: #2563eb; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .status { color: #475569; font-size: 13px; margin-bottom: 8px; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
    .meta span { margin-right: 16px; }
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
  <h1>${profile.name || 'Seu nome'}</h1>
  <div class="username">@${profile.username || 'username'}</div>
  <div class="status">${profile.professional_status || ''}</div>
  <div class="meta">
    ${profile.location ? `<span>📍 ${profile.location}</span>` : ''}
    ${profile.institution ? `<span>🎓 ${profile.institution}</span>` : ''}
    ${profile.interest_area ? `<span>💼 ${profile.interest_area}</span>` : ''}
  </div>
  ${profile.about ? `<h2>Sobre</h2><p class="about">${profile.about}</p>` : ''}
  ${skills.length ? `<h2>Habilidades</h2><p class="skills">${skillList}</p>` : ''}
  ${experiences.length ? `<h2>Experiências</h2>${expList}` : ''}
  ${courses.length ? `<h2>Cursos</h2><ul>${courseList}</ul>` : ''}
  ${certificates.length ? `<h2>Certificados</h2><ul>${certList}</ul>` : ''}
  ${projects.length ? `<h2>Projetos</h2><ul>${prjList}</ul>` : ''}
  </body></html>`;
}
