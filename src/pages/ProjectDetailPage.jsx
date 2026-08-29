import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, MapPin, ShieldCheck, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProjects, fetchProjectsFromSupabase } from '../utils/projectData';
import ContactForm from '../components/ContactForm';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [projects, setProjects] = useState(getProjects());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setProjects(getProjects());
    fetchProjectsFromSupabase().then(dbProjs => {
      if (dbProjs) setProjects(dbProjs);
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setCurrentSlide(0);
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
  const allImages = [projectImg, ...(project.gallery || [])].filter(Boolean);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

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
              
              {/* Slider Container */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '460px', 
                  overflow: 'hidden', 
                  borderRadius: '8px', 
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: 'var(--dark-charcoal)'
                }}
              >
                {/* Slides Wrapper */}
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img
                    src={allImages[currentSlide]}
                    alt={`${project.title} slide ${currentSlide + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease-in-out' }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '80px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                {/* Arrow Buttons (Only if multiple images exist) */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={nextSlide}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '16px',
                        transform: 'translateY(-50%)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        border: '1px solid rgba(63, 64, 66, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--dark-charcoal)',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)',
                        zIndex: 10,
                        transition: 'all 0.25s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-gold)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                        e.currentTarget.style.color = 'var(--dark-charcoal)';
                      }}
                    >
                      <ChevronRight size={22} />
                    </button>

                    <button
                      onClick={prevSlide}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '16px',
                        transform: 'translateY(-50%)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        border: '1px solid rgba(63, 64, 66, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--dark-charcoal)',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)',
                        zIndex: 10,
                        transition: 'all 0.25s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-gold)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                        e.currentTarget.style.color = 'var(--dark-charcoal)';
                      }}
                    >
                      <ChevronLeft size={22} />
                    </button>
                  </>
                )}

                {/* Dot indicators at the bottom */}
                {allImages.length > 1 && (
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '0.5rem',
                      zIndex: 10
                    }}
                  >
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        style={{
                          width: currentSlide === idx ? '24px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: currentSlide === idx ? 'var(--primary-gold)' : 'rgba(255, 255, 255, 0.6)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Grid at Bottom */}
              {allImages.length > 1 && (
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dark-charcoal)', marginBottom: '0.65rem', textAlign: 'right' }}>
                    تصفح صور المشروع ({allImages.length})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.6rem' }}>
                    {allImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setCurrentSlide(idx)}
                        style={{ 
                          height: '60px', 
                          borderRadius: '4px', 
                          overflow: 'hidden', 
                          boxShadow: 'var(--shadow-sm)', 
                          border: currentSlide === idx ? '2.5px solid var(--primary-gold)' : '1px solid var(--light-beige)',
                          cursor: 'pointer',
                          opacity: currentSlide === idx ? 1 : 0.7,
                          transition: 'all 0.2s'
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`${project.title} thumb ${idx + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
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
