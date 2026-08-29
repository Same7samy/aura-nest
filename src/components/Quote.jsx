import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Quote() {
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';

  return (
    <section
      style={{
        backgroundColor: 'var(--ivory)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        borderTop: '1px solid var(--light-beige)',
        borderBottom: '1px solid var(--light-beige)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Decorative Gold Accent Lines */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          bottom: '15%',
          left: '8%',
          width: '1px',
          backgroundColor: 'rgba(161, 154, 140, 0.25)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '15%',
          bottom: '15%',
          right: '8%',
          width: '1px',
          backgroundColor: 'rgba(161, 154, 140, 0.25)'
        }}
      />

      <div className="container" style={{ maxWidth: '850px', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          viewport={{ once: true, margin: '50px' }}
          style={{
            textAlign: 'center',
            padding: '2rem 1.5rem',
            position: 'relative'
          }}
        >
          {/* Top Decorative Quote Mark */}
          <span
            style={{
              position: 'absolute',
              top: '-30px',
              right: '50%',
              transform: 'translateX(50%)',
              fontSize: '5rem',
              fontFamily: 'var(--font-title)',
              color: 'rgba(161, 154, 140, 0.15)',
              lineHeight: 1,
              userSelect: 'none'
            }}
          >
            “
          </span>

          {/* Quote Text */}
          <blockquote
            style={{
              fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)',
              fontWeight: 700,
              color: 'var(--dark-charcoal)',
              lineHeight: '1.6',
              marginBottom: '1rem',
              position: 'relative',
              zIndex: 2,
              fontFamily: 'var(--font-arabic)'
            }}
          >
            {isRtl 
              ? 'نبني رؤية أحلامكم — بعقلية هندسية، وتفاصيل تليق بتطلعاتكم.'
              : 'Building your dream vision — with an engineering mindset, and details worthy of your aspirations.'}
          </blockquote>

          {/* Golden signature dash */}
          <div
            style={{
              width: '50px',
              height: '3px',
              backgroundColor: 'var(--primary-gold)',
              margin: '1.5rem auto 0 auto',
              borderRadius: '2px'
            }}
          />

          <span
            style={{
              display: 'block',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--primary-gold)',
              fontWeight: 700,
              marginTop: '0.75rem'
            }}
          >
            AURA NEST
          </span>
        </motion.div>
      </div>
    </section>
  );
}
