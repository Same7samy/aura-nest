import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Hammer, Palette, Layers, ClipboardCheck, Building } from 'lucide-react';
import { getProjects, fetchProjectsFromSupabase, getCategories, fetchCategoriesFromSupabase } from '../utils/projectData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export default function Portfolio() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [categoryImages, setCategoryImages] = useState({});
  const [projects, setProjects] = useState(getProjects());
  const [categories, setCategories] = useState(getCategories());

  const updateImages = (cats, projs) => {
    const images = {};
    cats.forEach(cat => {
      const catProjs = projs.filter(p => p.category === cat.title);
      if (catProjs.length > 0) {
        const randomProj = catProjs[Math.floor(Math.random() * catProjs.length)];
        images[cat.id] = randomProj.customImg || randomProj.defaultImg;
      } else {
        images[cat.id] = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
      }
    });
    setCategoryImages(images);
  };

  useEffect(() => {
    const localCats = getCategories();
    const localProjs = getProjects();
    setCategories(localCats);
    setProjects(localProjs);
    updateImages(localCats, localProjs);

    Promise.all([fetchCategoriesFromSupabase(), fetchProjectsFromSupabase()]).then(([dbCats, dbProjs]) => {
      if (dbCats) setCategories(dbCats);
      if (dbProjs) setProjects(dbProjs);
      updateImages(dbCats || localCats, dbProjs || localProjs);
    });
  }, []);

  const getCategoryCount = (categoryTitle) => {
    return projects.filter(p => p.category === categoryTitle).length;
  };

  const getIcon = (id) => {
    switch (id) {
      case 'architecture': return <Compass size={24} style={{ color: 'var(--primary-gold)' }} />;
      case 'contracting': return <Hammer size={24} style={{ color: 'var(--primary-gold)' }} />;
      case 'interior': return <Palette size={24} style={{ color: 'var(--primary-gold)' }} />;
      case 'facades': return <Layers size={24} style={{ color: 'var(--primary-gold)' }} />;
      case 'supervision': return <ClipboardCheck size={24} style={{ color: 'var(--primary-gold)' }} />;
      case 'marketing': return <Building size={24} style={{ color: 'var(--primary-gold)' }} />;
      default: return <Compass size={24} style={{ color: 'var(--primary-gold)' }} />;
    }
  };

  return (
    <section id="portfolio" className="section-padding" style={{ backgroundColor: 'var(--ivory)' }}>
      <div className="container">
        
        <div className="section-title-wrapper" style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <span className="section-subtitle" style={{ right: isRtl ? 0 : 'auto', left: isRtl ? 'auto' : 0, transform: 'none' }}>
            {t.navPortfolio}
          </span>
          <h2 className="section-main-title">
            {isRtl ? 'تصفح مشاريعنا حسب قطاعات الهندسة والتشطيب' : 'Browse Projects by Engineering Sectors'}
          </h2>
        </div>

        <div
          style={{
            marginTop: '3rem'
          }}
          className="categories-grid"
        >
          {categories.map((cat) => {
            const projectCount = getCategoryCount(cat.title);
            const bgImg = categoryImages[cat.id] || '';
            const catTitle = (!isRtl && cat.titleEn) ? cat.titleEn : cat.title;
            const catDesc = (!isRtl && cat.descEn) ? cat.descEn : cat.desc;
            
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="card category-select-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  backgroundColor: 'var(--white)',
                  borderRadius: '6px',
                  overflow: 'visible',
                  position: 'relative',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                {/* Image container — clips only the image */}
                <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden', borderRadius: '6px 6px 0 0' }}>
                  <img
                    src={bgImg}
                    alt={catTitle}
                    className="category-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(63, 64, 66, 0.4) 0%, rgba(63, 64, 66, 0) 100%)'
                    }}
                  />
                </div>

                {/* Icon circle — sits on top of the card border, outside the image overflow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '178px',
                    right: isRtl ? '24px' : 'auto',
                    left: isRtl ? 'auto' : '24px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid rgba(161, 154, 140, 0.15)',
                    zIndex: 10
                  }}
                >
                  {getIcon(cat.id)}
                </div>

                <div
                  style={{
                    padding: '2.25rem 1.75rem 2rem 1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    flexGrow: 1,
                    textAlign: isRtl ? 'right' : 'left'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row' : 'row-reverse' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-charcoal)', margin: 0 }}>
                      {catTitle}
                    </h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--light-beige)',
                      color: 'var(--primary-gold)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      flexShrink: 0
                    }}>
                      {isRtl ? `${projectCount} مشاريع` : `${projectCount} Projects`}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.94rem', color: 'var(--text-gray)', lineHeight: 1.6, margin: 0 }}>
                    {catDesc}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem', 
                    color: 'var(--primary-gold)', 
                    fontWeight: 700, 
                    fontSize: '0.9rem',
                    flexDirection: isRtl ? 'row' : 'row'
                  }}>
                    <span>{isRtl ? 'تصفح أعمال القطاع' : 'Browse Sector Projects'}</span>
                    <ArrowLeft 
                      size={16} 
                      style={{ 
                        transition: 'transform 0.3s',
                        transform: isRtl ? 'none' : 'rotate(180deg)'
                      }} 
                      className="arrow-icon" 
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
