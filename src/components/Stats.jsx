import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

function CountUp({ to, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(to, 10);
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';

  const statsAr = [
    {
      value: '50',
      suffix: '+',
      title: 'مشروع منفذ',
      desc: 'صروح سكنية وتجارية تم تسليمها بمستويات تشطيب وتفاصيل هندسية بالغة الدقة.'
    },
    {
      value: '6',
      suffix: '',
      title: 'خدمات متكاملة',
      desc: 'من التطوير المعماري والإنشائي الأولي وحتى اللمسات الزخرفية النهائية والفرش الفاخر.'
    },
    {
      value: '100',
      suffix: '٪',
      title: 'إشراف هندسي',
      desc: 'رقابة ميدانية يومية صارمة وتقارير فنية مرحلية لضمان الالتزام المطلق بالمعايير والمخططات المعتمدة.'
    }
  ];

  const statsEn = [
    {
      value: '50',
      suffix: '+',
      title: 'Executed Projects',
      desc: 'Residential and commercial structures delivered with high-precision finishes and engineering details.'
    },
    {
      value: '6',
      suffix: '',
      title: 'Integrated Services',
      desc: 'From preliminary architectural design to final decorative details and luxury furnishings.'
    },
    {
      value: '100',
      suffix: '%',
      title: 'Engineering Supervision',
      desc: 'Strict daily field supervision and periodic technical reports to ensure absolute compliance.'
    }
  ];

  const statsList = isRtl ? statsAr : statsEn;

  return (
    <section
      style={{
        backgroundColor: 'var(--dark-charcoal)',
        color: 'var(--white)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle architectural background texture */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'linear-gradient(to right, #8a8884 1px, transparent 1px), linear-gradient(to bottom, #8a8884 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            textAlign: 'center'
          }}
        >
          {statsList.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.06, duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              viewport={{ once: true, amount: 0.05 }}
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {/* Stat number */}
              <h2
                style={{
                  fontSize: 'clamp(3rem, 8vw, 4.5rem)',
                  fontWeight: 800,
                  color: 'var(--primary-gold)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1',
                  direction: 'ltr',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {stat.suffix === '+' && <span>+</span>}
                <CountUp to={stat.value} duration={1.5} />
                {stat.suffix !== '+' && <span>{stat.suffix}</span>}
              </h2>
              
              {/* Stat title */}
              <h3
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginTop: '0.5rem',
                  borderBottom: '2px solid rgba(161, 154, 140, 0.3)',
                  paddingBottom: '0.5rem',
                  width: 'fit-content'
                }}
              >
                {stat.title}
              </h3>
              
              {/* Stat description */}
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--light-beige)',
                  maxWidth: '260px',
                  lineHeight: '1.6',
                  opacity: 0.8
                }}
              >
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
