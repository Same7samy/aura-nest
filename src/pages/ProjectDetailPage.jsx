import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, MapPin, ShieldCheck, MessageSquare } from 'lucide-react';
import { getProjects, fetchProjectsFromSupabase } from '../utils/projectData';
import ContactForm from '../components/ContactForm';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [projects, setProjects] = useState(getProjects());
  useEffect(() => {
    setProjects(getProjects());
    fetchProjectsFromSupabase().then(dbProjs => {
      if (dbProjs) setProjects(dbProjs);
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

  const project = projects.find(p => p.id === parseInt(id)) || {};

  const getWhatsAppLink = (projectTitle) => {
    const text = `السلام عليكم، أود الاستفسار عن تفاصيل مشروع: ${projectTitle}`;
    return `https://wa.me/201111014008?text=${encodeURIComponent(text)}`;
  };

  if (!project.id) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '6rem', textAlign: 'center', backgroundColor: 'var(--ivory)' }}>
        <div className="container">
          <h2>المشروع غير موجود</h2>
          <Link to="/#portfolio" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-flex', textDecoration: 'none' }}>الرجوع للمعرض</Link>
        </div>
      </div>
    );
  }

  const projectImg = project.customImg || project.defaultImg;

  return (
    <div style={{ backgroundColor: 'var(--ivory)' }}>
      {/* Project Banner Header */}
      <div
        style={{
          position: 'relative',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          backgroundImage: `url(${projectImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: '80px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(63, 64, 66, 0.75) 0%, rgba(63, 64, 66, 0.95) 100%)',
            zIndex: 1
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem' }}>
          <span style={{ color: 'var(--primary-gold)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            {project.category}
          </span>
          <h1 style={{ color: 'var(--white)', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-arabic)', margin: 0 }}>
            {project.title}
          </h1>
          <p style={{ color: 'var(--light-beige)', opacity: 0.8, fontSize: '1rem', marginTop: '0.5rem', fontWeight: 600 }}>
            {project.subtitle}
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="project-detail-grid">
            {/* Visual Column - Right Column in RTL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'relative', width: '100%', height: '460px', overflow: 'hidden', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                <img
                  src={projectImg}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Gallery Images Grid */}
              {project.gallery && project.gallery.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-charcoal)', marginBottom: '0.75rem', textAlign: 'right' }}>
                    معرض الصور الكامل للمشروع
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
                    {project.gallery.map((img, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          height: '90px', 
                          borderRadius: '6px', 
                          overflow: 'hidden', 
                          boxShadow: 'var(--shadow-sm)', 
                          border: '1px solid var(--light-beige)'
                        }}
                      >
                        <a href={img} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                          <img 
                            src={img} 
                            alt={`${project.title} gallery ${idx + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Information Column - Left Column in RTL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'right' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '0.5rem' }}>
                  تفاصيل العمل الهندسي
                </h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-gray)', lineHeight: 1.8 }}>
                  {project.desc}
                </p>
              </div>

              {/* Technical Specifications Card */}
              <div
                style={{
                  backgroundColor: 'var(--light-beige)',
                  borderRadius: '6px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dark-charcoal)', borderBottom: '1px solid rgba(161, 154, 140, 0.25)', paddingBottom: '0.5rem' }}>
                  المواصفات الفنية والتنفيذية
                </h4>

                <div className="specs-grid">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={18} style={{ color: 'var(--primary-gold)' }} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>مدة التنفيذ</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--dark-charcoal)' }}>{project.duration}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={18} style={{ color: 'var(--primary-gold)' }} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>عام الإنجاز</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--dark-charcoal)' }}>{project.year}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={18} style={{ color: 'var(--primary-gold)' }} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>الموقع</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--dark-charcoal)' }}>{project.location}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={18} style={{ color: 'var(--primary-gold)' }} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>المساحة المقدرة</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--dark-charcoal)' }}>{project.space}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(161, 154, 140, 0.25)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--warm-gray)', marginBottom: '0.25rem' }}>الخامات والمواد الأساسية</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--dark-charcoal)' }}>{project.materials}</strong>
                </div>
              </div>

              <a
                href={getWhatsAppLink(project.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  textDecoration: 'none',
                  marginTop: '1rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <MessageSquare size={20} />
                <span>طلب استشارة أو استفسار بخصوص هذا المشروع</span>
              </a>
            </div>
          </div>
        </div>
      </section>


      <ContactForm />
    </div>
  );
}
