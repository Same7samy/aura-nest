import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { getProjects, fetchProjectsFromSupabase, getCategories, fetchCategoriesFromSupabase } from '../utils/projectData';
import ContactForm from '../components/ContactForm';

export default function CategoryPage() {
  const { id } = useParams();
  const [projects, setProjects] = useState(getProjects());
  const [categories, setCategories] = useState(getCategories());
  const [activeUploadProject, setActiveUploadProject] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const decodedId = id ? decodeURIComponent(id).trim() : '';
  const categoryObj = categories.find(c => (c.id || '').trim() === decodedId) || {};
  const categoryTitle = (categoryObj.title || '').trim();
  const categoryDesc = categoryObj.desc || '';

  useEffect(() => {
    setCategories(getCategories());
    setProjects(getProjects());

    fetchCategoriesFromSupabase().then(dbCats => {
      if (dbCats) setCategories(dbCats);
    });
    fetchProjectsFromSupabase().then(dbProjs => {
      if (dbProjs) setProjects(dbProjs);
    });

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = (projectId) => {
    if (!previewImage) return;

    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, customImg: previewImage } : p))
    );

    const savedImages = localStorage.getItem('aura_nest_custom_images') || '{}';
    try {
      const parsed = JSON.parse(savedImages);
      parsed[projectId] = previewImage;
      localStorage.setItem('aura_nest_custom_images', JSON.stringify(parsed));
    } catch (e) {
      console.error('Error saving image', e);
    }

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setActiveUploadProject(null);
      setPreviewImage(null);
    }, 2000);
  };

  const handleResetImage = (projectId) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, customImg: undefined } : p))
    );

    const savedImages = localStorage.getItem('aura_nest_custom_images') || '{}';
    try {
      const parsed = JSON.parse(savedImages);
      delete parsed[projectId];
      localStorage.setItem('aura_nest_custom_images', JSON.stringify(parsed));
    } catch (e) {
      console.error('Error resetting image', e);
    }
  };

  const categoryProjects = projects.filter(p => (p.category || '').trim() === categoryTitle);
  const randomProj = categoryProjects[Math.floor(Math.random() * categoryProjects.length)] || {};
  const bannerImg = categoryObj.bannerImg
    || randomProj.customImg
    || randomProj.defaultImg
    || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div style={{ backgroundColor: 'var(--ivory)' }}>
      {/* Luxury Category Banner */}
      <div
        style={{
          position: 'relative',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          backgroundImage: `url(${bannerImg})`,
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
            القطاع الهندسي
          </span>
          <h1 style={{ color: 'var(--white)', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-arabic)', margin: 0 }}>
            {categoryTitle}
          </h1>
          <p style={{ color: 'var(--light-beige)', opacity: 0.8, fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            {categoryDesc}
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ paddingTop: '4rem' }}>
        <div className="container">
          {categoryProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: 'var(--white)', borderRadius: '6px', border: '1px solid var(--light-beige)' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-gray)' }}>لم يتم رفع أي مشاريع في هذا القطاع بعد.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {categoryProjects.map((project) => (
                <div
                  key={project.id}
                  className="card project-item-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--white)',
                    borderRadius: '6px',
                    border: '1px solid var(--light-beige)',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                >
                  <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={project.customImg || project.defaultImg}
                      alt={project.title}
                      className="project-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                    
                    {/* Dynamic Badges float style updated */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(63, 64, 66, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: 'var(--primary-gold)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: '1px solid rgba(161, 154, 140, 0.3)',
                        fontFamily: 'var(--font-arabic)',
                        zIndex: 3
                      }}
                    >
                      AURA NEST {project.badgeText}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '1.75rem 1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      flexGrow: 1,
                      textAlign: 'right'
                    }}
                  >
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark-charcoal)', margin: 0 }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-gray)', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                      {project.desc.substring(0, 100)}...
                    </p>

                    <div style={{ marginTop: '0.75rem' }}>
                      <Link
                        to={`/project/${project.id}`}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          fontSize: '0.88rem',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          textDecoration: 'none'
                        }}
                      >
                        تفاصيل المشروع
                      </Link>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          )}
        </div>
      </section>


      <ContactForm />
    </div>
  );
}
