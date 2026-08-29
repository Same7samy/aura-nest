import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function Hero() {
  const heroImages = ['/hero1.png', '/hero2.png', '/hero3.png', '/hero4.png', '/hero5.png'];
  const captions = [
    "تصاميم سكنية راقية",
    "تفاصيل تشطيبات مذهلة",
    "تخطيط ودراسة معمارية",
    "فخامة اللمسات المعاصرة",
    "إشراف هندسي متكامل"
  ];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };



  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '7.5rem',
        paddingBottom: '2.5rem',
        background: 'radial-gradient(circle at 10% 20%, rgba(161, 154, 140, 0.08) 0%, rgba(246, 244, 238, 1) 90%)',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(161,154,140,0.06) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(161,154,140,0.05) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Blueprint Grid Lines Accent */}
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '15%',
          width: '35%',
          height: '60%',
          opacity: 0.04,
          borderRight: '1px solid var(--dark-charcoal)',
          borderBottom: '1px solid var(--dark-charcoal)',
          backgroundImage: 'radial-gradient(var(--dark-charcoal) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
          display: 'none'
        }}
        className="blueprint-accent"
      />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem', alignItems: 'center' }} className="hero-grid">
          
          {/* Main content column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'right' }}
          >
            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: 'clamp(2.3rem, 5.5vw, 4.25rem)',
                fontWeight: 800,
                lineHeight: 1.4,
                color: 'var(--dark-charcoal)'
              }}
            >
              نصنع الخيال معاً… <br />
              <span className="text-gradient">ونشرف على تحقيقه</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                color: 'var(--text-gray)',
                maxWidth: '600px',
                lineHeight: 1.7
              }}
            >
              منظومة هندسية متكاملة تصيغ المساحات السكنية والتجارية بحلول تشطيبية ومعمارية راقية، نرافقكم فيها من الفكرة الأولى وحتى تسليم المفتاح.
            </motion.p>

            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: '0.75rem',
                marginTop: '0.5rem',
                width: '100%',
                maxWidth: '500px'
              }}
            >
              <a
                href="https://wa.me/201111014008"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  fontSize: '0.9rem',
                  padding: '0.85rem 1rem',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  justifyContent: 'center'
                }}
              >
                <MessageSquare size={17} style={{ marginLeft: '0.35rem' }} />
                تواصل واتساب
              </a>
              <button
                onClick={() => handleScrollTo('services')}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.9rem',
                  padding: '0.85rem 1rem',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  justifyContent: 'center'
                }}
              >
                استكشف خدماتنا
                <ArrowLeft size={17} style={{ marginRight: '0.35rem' }} />
              </button>
            </motion.div>
          </motion.div>

          {/* Visual Showcase Column - ChatGPT Image Slider in Layered Stack (No gold frames, enlarged size) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '270px',
              marginTop: '2.5rem',
              width: '100%'
            }}
            className="hero-visual-col"
          >
            {/* Large Subtle Background Logo Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="slider-watermark"
            >
              <img
                src="/logo.png"
                alt="Brand Watermark"
                style={{
                  width: '320px',
                  height: '320px',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Enlarged Slider Wrapper */}
            <div
              style={{
                position: 'relative',
                width: '300px',
                height: '188px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}
              className="slider-rect-wrapper"
            >
              {/* Layered Stack of Rounded Rectangles (Active clear, background blurred peeking out, occupying full dimensions) */}
              {heroImages.map((img, idx) => {
                const relativeIdx = (idx - currentImageIdx + heroImages.length) % heroImages.length;
                
                // Set z-index and style parameters based on stack order
                let zIndex = 10;
                let xShift = 0;
                let yShift = 0;
                let scale = 1;
                let opacity = 1;
                let blurFilter = 'blur(0px)';
                
                if (relativeIdx === 0) {
                  zIndex = 10;
                  xShift = 0;
                  yShift = 0;
                  scale = 1;
                  opacity = 1;
                  blurFilter = 'blur(0px)';
                } else if (relativeIdx === 1) {
                  zIndex = 8;
                  xShift = 25;
                  yShift = 15;
                  scale = 0.88;
                  opacity = 0.75;
                  blurFilter = 'blur(4px)';
                } else if (relativeIdx === 2) {
                  zIndex = 6;
                  xShift = 50;
                  yShift = 30;
                  scale = 0.78;
                  opacity = 0.4;
                  blurFilter = 'blur(8px)';
                } else {
                  zIndex = 1;
                  xShift = 50;
                  yShift = 30;
                  scale = 0.78;
                  opacity = 0;
                  blurFilter = 'blur(8px)';
                }

                return (
                  <motion.div
                    key={idx}
                    animate={{
                      x: xShift,
                      y: yShift,
                      scale: scale,
                      opacity: opacity,
                      filter: blurFilter,
                    }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      zIndex: zIndex,
                      backgroundColor: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    <img
                      src={img}
                      alt={`Aura Nest Showcase ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    
                    {/* Attached floating badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '8%',
                        backgroundColor: 'rgba(63, 64, 66, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--white)',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        boxShadow: 'var(--shadow-md)',
                        borderRight: '3px solid var(--primary-gold)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.1rem',
                        pointerEvents: 'none'
                      }}
                    >
                      <strong style={{ fontSize: '0.75rem', color: 'var(--primary-gold)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>AURA NEST</strong>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{captions[idx]}</span>
                    </div>
                  </motion.div>
                );
              })}
              

            </div>
            
            {/* Old static badge removed */}
          </motion.div>
        </div>


      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
          .hero-visual-col {
            height: 480px !important;
            margin-top: 0 !important;
            padding-left: 1rem !important;
          }
          .slider-rect-wrapper {
            width: 500px !important;
            height: 312px !important;
          }
          .slider-watermark img {
            width: 500px !important;
            height: 500px !important;
          }
          .blueprint-accent {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
