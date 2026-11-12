import { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { supabase, type Course, type CourseModule, type CourseProgress } from '@/lib/supabase';
import { PageHero } from '@/components/Layout';

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Record<string, CourseModule[]>>({});
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data: coursesData } = await supabase.from('courses').select('*').order('sort_order');
    if (coursesData) {
      setCourses(coursesData as Course[]);
      const { data: modulesData } = await supabase.from('course_modules').select('*').order('sort_order');
      if (modulesData) {
        const map: Record<string, CourseModule[]> = {};
        (modulesData as CourseModule[]).forEach((m) => {
          if (!map[m.course_id]) map[m.course_id] = [];
          map[m.course_id].push(m);
        });
        setModules(map);
      }
    }
    const { data: progressData } = await supabase.from('course_progress').select('*');
    if (progressData) setProgress(progressData as CourseProgress[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const isModuleCompleted = (moduleId: string) => progress.some((p) => p.module_id === moduleId && p.completed);

  const getCourseProgress = (courseId: string) => {
    const courseModules = modules[courseId] || [];
    if (courseModules.length === 0) return 0;
    const completed = courseModules.filter((m) => isModuleCompleted(m.id)).length;
    return Math.round((completed / courseModules.length) * 100);
  };

  const getCompletedCount = (courseId: string) => {
    const courseModules = modules[courseId] || [];
    return courseModules.filter((m) => isModuleCompleted(m.id)).length;
  };

  const getLastWatchedModule = (courseId: string): CourseModule | null => {
    const courseModules = modules[courseId] || [];
    const firstUncompleted = courseModules.find((m) => !isModuleCompleted(m.id));
    return firstUncompleted || courseModules[0] || null;
  };

  const toggleModuleComplete = async (module: CourseModule) => {
    const existing = progress.find((p) => p.module_id === module.id);
    if (existing) {
      const newCompleted = !existing.completed;
      setProgress((prev) => prev.map((p) => p.module_id === module.id ? { ...p, completed: newCompleted } : p));
      await supabase.from('course_progress').update({ completed: newCompleted, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      const newProgress: CourseProgress = {
        id: crypto.randomUUID(),
        course_id: module.course_id,
        module_id: module.id,
        completed: true,
        updated_at: new Date().toISOString(),
      };
      setProgress((prev) => [...prev, newProgress]);
      await supabase.from('course_progress').insert({ course_id: module.course_id, module_id: module.id, completed: true });
    }
  };

  // Course detail view
  if (selectedCourse) {
    const courseModules = modules[selectedCourse.id] || [];
    const courseProgress = getCourseProgress(selectedCourse.id);
    const completedCount = getCompletedCount(selectedCourse.id);

    return (
      <section className="section page-section">
        <div className="container narrow-container">
          <button className="back-btn" onClick={() => { setSelectedCourse(null); setSelectedModule(null); }}>
            <ChevronLeft size={16} /> Voltar aos cursos
          </button>

          <div className="course-detail-header">
            <div className="course-detail-cover">
              {selectedCourse.cover_url ? (
                <img src={selectedCourse.cover_url} alt={selectedCourse.title} />
              ) : (
                <div className="course-cover-placeholder"><PlayCircle size={36} /></div>
              )}
            </div>
            <div className="course-detail-info">
              <h2>{selectedCourse.title}</h2>
              <p>{selectedCourse.description}</p>
              <div className="course-detail-meta">
                <span><Clock size={14} /> {courseModules.length} módulos</span>
                <span>Por {selectedCourse.instructor}</span>
              </div>
              <div className="course-progress-bar-large">
                <div className="course-progress-track">
                  <div className="course-progress-fill" style={{ width: `${courseProgress}%` }} />
                </div>
                <span>{courseProgress}% concluído · {completedCount}/{courseModules.length} módulos</span>
              </div>
            </div>
          </div>

          {/* Video player area */}
          {selectedModule && (
            <div className="course-video-area">
              {selectedModule.youtube_url ? (
                <div className="course-video-embed">
                  <iframe
                    src={selectedModule.youtube_url.replace('watch?v=', 'embed/')}
                    title={selectedModule.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="course-video-placeholder">
                  <PlayCircle size={48} />
                  <p>Espaço reservado para o vídeo do YouTube</p>
                  <span>O link do vídeo será adicionado em breve para: {selectedModule.title}</span>
                </div>
              )}
              <div className="course-video-info">
                <div>
                  <h3>{selectedModule.title}</h3>
                  <p>Módulo {courseModules.findIndex((m) => m.id === selectedModule.id) + 1} de {courseModules.length}</p>
                </div>
                <button
                  className={`button button-small ${isModuleCompleted(selectedModule.id) ? 'button-ghost' : 'button-blue'}`}
                  onClick={() => toggleModuleComplete(selectedModule)}
                >
                  {isModuleCompleted(selectedModule.id) ? (
                    <><CheckCircle2 size={15} /> Concluído</>
                  ) : (
                    <><Check size={15} /> Marcar como concluído</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Modules list */}
          <div className="course-modules-list">
            <h3>Módulos do curso</h3>
            {courseModules.map((module, i) => {
              const completed = isModuleCompleted(module.id);
              const isActive = selectedModule?.id === module.id;
              return (
                <button
                  key={module.id}
                  className={`course-module-row ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedModule(module)}
                >
                  <div className="course-module-check">
                    {completed ? <CheckCircle2 size={20} className="text-blue-450" /> : <Circle size={20} />}
                  </div>
                  <div className="course-module-info">
                    <span className="course-module-number">Módulo {i + 1}</span>
                    <strong>{module.title}</strong>
                  </div>
                  {isActive && <ArrowRight size={16} className="text-blue-450" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker="Cursos First Step"
        title={<>Aprenda no seu <span className="text-blue-450">ritmo.</span></>}
        subtitle="Cursos gratuitos produzidos pela equipe First Step. Acompanhe seu progresso e continue de onde parou."
      />

      <section className="section page-section">
        <div className="container">
          {loading ? (
            <p className="empty-state">Carregando cursos...</p>
          ) : courses.length === 0 ? (
            <div className="empty-state-card">
              <PlayCircle size={36} />
              <h3>Nenhum curso disponível</h3>
              <p>Os cursos aparecerão aqui em breve.</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => {
                const courseModules = modules[course.id] || [];
                const courseProgress = getCourseProgress(course.id);
                const completedCount = getCompletedCount(course.id);
                const lastModule = getLastWatchedModule(course.id);
                const started = courseProgress > 0;

                return (
                  <article key={course.id} className="course-card">
                    <div className="course-card-cover">
                      {course.cover_url ? (
                        <img src={course.cover_url} alt={course.title} />
                      ) : (
                        <div className="course-cover-placeholder"><PlayCircle size={32} /></div>
                      )}
                      <div className="course-card-progress-badge">{courseProgress}%</div>
                    </div>
                    <div className="course-card-body">
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-card-meta">
                        <span><PlayCircle size={13} /> {courseModules.length} módulos</span>
                        <span>{completedCount}/{courseModules.length} concluídos</span>
                      </div>
                      <div className="course-progress-bar">
                        <div className="course-progress-track">
                          <div className="course-progress-fill" style={{ width: `${courseProgress}%` }} />
                        </div>
                      </div>
                      <button
                        className="button button-blue button-small course-card-btn"
                        onClick={() => {
                          setSelectedCourse(course);
                          setSelectedModule(lastModule);
                        }}
                      >
                        {started ? 'Continuar curso' : 'Começar curso'} <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
