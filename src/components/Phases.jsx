import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Paintbrush, Key } from 'lucide-react';

export default function Phases() {
  const phases = [
    {
      icon: <Compass size={28} style={{ color: 'var(--primary-gold)' }} />,
      title: 'صياغة المفهوم',
      desc: 'تحليل المساحة ودراسة تطلعات العميل لوضع مخططات هندسية وفراغية متميزة تلائم ذوقه الرفيع.'
    },
    {
      icon: <Paintbrush size={28} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التنفيذ المتقن',
      desc: 'تجسيد التصاميم على أرض الواقع عبر أعمال مقاولات وحلول إنشائية دقيقة تلتزم بأعلى معايير الجودة.'
    },
    {
      icon: <Key size={28} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التسليم الراقي',
      desc: 'تقديم مساحتك متكاملة الجاهزية وبمستوى تشطيب يفوق التوقعات، وبصمة تليق باسم Aura Nest.'
    }
  ];

  return (
    <section
      id="phases"
      style={{
        backgroundColor: 'var(--ivory)',
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
        borderBottom: '1px solid rgba(161, 154, 140, 0.15)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {phases.map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.25, 1, 0.5, 1] }}
              viewport={{ once: true, amount: 0.05 }}
              className="card glass-panel"
              style={{
                padding: '2rem 1.75rem',
                borderRight: '4px solid var(--primary-gold)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backgroundColor: 'var(--white)',
                textAlign: 'right'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(161, 154, 140, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {phase.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
                {phase.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-gray)', lineHeight: 1.6, margin: 0 }}>
                {phase.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
