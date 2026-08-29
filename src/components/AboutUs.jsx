import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Award, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  Eye, 
  Building2, 
  Compass,
  Coins
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export default function AboutUs() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const aboutSections = [
    {
      title: t.aboutIdentity,
      icon: <Building2 size={22} style={{ color: 'var(--primary-gold)' }} />,
      desc: t.aboutIdentityDesc
    },
    {
      title: t.aboutVision,
      icon: <Eye size={22} style={{ color: 'var(--primary-gold)' }} />,
      desc: t.aboutVisionDesc
    },
    {
      title: t.aboutMission,
      icon: <Target size={22} style={{ color: 'var(--primary-gold)' }} />,
      desc: t.aboutMissionDesc
    },
    {
      title: t.aboutValues,
      icon: <Award size={22} style={{ color: 'var(--primary-gold)' }} />,
      desc: t.aboutValuesDesc
    }
  ];

  const pillarsAr = [
    {
      number: '01',
      icon: <Award size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'معايير إتقان تتجاوز المألوف',
      desc: 'نخضع كل تفصيلة معمارية وإنشائية لعمليات تدقيق هندسية دقيقة تفوق الكود التقليدي لضمان الاستدامة.'
    },
    {
      number: '02',
      icon: <Coins size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'إدارة ذكية للتكلفة والخامات',
      desc: 'نساعدك على تقليل تكاليف المشروع من خلال اختيار الخامات المناسبة، ودراسة البدائل، والحصول على أفضل الأسعار، مع التحكم في الكميات وتقليل الهدر دون التأثير على جودة التنفيذ.'
    },
    {
      number: '03',
      icon: <Users size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'فريق استشاري متعدد التخصصات',
      desc: 'مهندسون استشاريون، ومصممون داخليون، ومدراء مشاريع يعملون بتناغم كامل لتحقيق رؤية موحدة.'
    },
    {
      number: '04',
      icon: <ShieldCheck size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التزام صارم بالمواعيد والميزانية',
      desc: 'إدارة هندسية محكمة تضمن تسليم المشاريع في مواعيدها المحددة دون أي زيادة في التكاليف المتفق عليها.'
    },
    {
      number: '05',
      icon: <HeartHandshake size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'شراكة ممتدة وخدمة ما بعد التسليم',
      desc: 'استشارات هندسية وصيانة دورية تضمن الحفاظ على بهاء وقيمة استثمارك المعماري على المدى الطويل.'
    }
  ];

  const pillarsEn = [
    {
      number: '01',
      icon: <Award size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Standards Exceeding the Ordinary',
      desc: 'We subject every architectural and structural detail to rigorous engineering checks beyond standard codes to ensure sustainability.'
    },
    {
      number: '02',
      icon: <Coins size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Smart Cost & Materials Management',
      desc: 'We help you lower project costs by selecting optimal materials, analyzing alternatives, and sourcing best rates while reducing wastage.'
    },
    {
      number: '03',
      icon: <Users size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Multidisciplinary Consulting Team',
      desc: 'Consulting engineers, interior designers, and project managers working in perfect harmony to realize a unified vision.'
    },
    {
      number: '04',
      icon: <ShieldCheck size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Strict Schedule & Budget Compliance',
      desc: 'Controlled engineering management guarantees project handovers on schedule without any increase in agreed costs.'
    },
    {
      number: '05',
      icon: <HeartHandshake size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Extended Partnership & Post-Delivery Support',
      desc: 'Engineering consultations and periodic maintenance to preserve the value of your architectural investment long-term.'
    }
  ];

  const pillars = isRtl ? pillarsAr : pillarsEn;

  return (
    <section id="about" className="section-padding" style={{ backgroundColor: 'var(--ivory)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Subtle Ambient Background Gradients */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          right: isRtl ? '-5%' : 'auto',
          left: isRtl ? 'auto' : '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(161, 154, 140, 0.08) 0%, rgba(246, 244, 238, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: isRtl ? '-5%' : 'auto',
          right: isRtl ? 'auto' : '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(63, 64, 66, 0.05) 0%, rgba(246, 244, 238, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section title */}
        <div className="section-title-wrapper" style={{ textAlign: isRtl ? 'right' : 'left', marginBottom: '4rem' }}>
          <span className="section-subtitle" style={{ right: isRtl ? 0 : 'auto', left: isRtl ? 'auto' : 0, transform: 'none' }}>{t.navAbout}</span>
          <h2 className="section-main-title">
            {isRtl 
              ? 'هوية تُبنى بالتفاصيل وتكتمل بالإتقان الهندسي' 
              : 'Identity Built on Details, Completed with Engineering Excellence'}
          </h2>
        </div>

        {/* Main Showcase Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '4rem', 
            alignItems: 'start', 
            marginBottom: '5rem' 
          }} 
          className="about-top-grid"
        >
          
          {/* Brand Philosophy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-charcoal)' }}>
                {isRtl ? 'منظومة معمارية وهندسية متكاملة تصنع الفارق' : 'An Integrated Architectural & Engineering System'}
              </h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-gray)', lineHeight: '1.8' }}>
                {isRtl ? (
                  <>
                    وُلدت <strong>AURA NEST</strong> لتكون الشريك الاستراتيجي في تحويل مساحات الأحلام إلى واقع ملموس. نحن لا نبني جدراناً، بل نُشكّل بيئات فراغية راقية تجمع بين التطور المعماري والابتكار التصميمي والانضباط الهندسي الصارم.
                  </>
                ) : (
                  <>
                    <strong>AURA NEST</strong> was born to be the strategic partner in transforming dream spaces into a tangible reality. We do not just build walls; we shape sophisticated spatial environments combining architectural advancement, design innovation, and strict engineering discipline.
                  </>
                )}
              </p>
            </div>

            {/* 2x2 Pillars Grid */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.75rem',
                marginTop: '1rem'
              }}
              className="about-pillars-grid"
            >
              {aboutSections.map((sec, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '1.25rem',
                    flexDirection: isRtl ? 'row' : 'row'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(161, 154, 140, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {sec.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: isRtl ? 'right' : 'left' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
                      {sec.title}
                    </h4>
                    <p style={{ fontSize: '0.94rem', color: 'var(--text-gray)', lineHeight: '1.6' }}>
                      {sec.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Showcase / Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: true, amount: 0.05 }}
            style={{ position: 'relative', width: '100%' }}
          >
            <div 
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--light-beige)'
              }}
            >
              <img
                src="/about_us_new.jpg"
                alt="Aura Nest Architectural Excellence"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                className="about-interactive-img"
              />
              
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(63, 64, 66, 0.85) 0%, rgba(63, 64, 66, 0.1) 45%, transparent 100%)',
                  pointerEvents: 'none'
                }}
              />

              {/* Bottom Image Stats Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  flexDirection: isRtl ? 'row' : 'row-reverse'
                }}
              >
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <span style={{ color: 'var(--primary-gold)', fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>
                    {isRtl ? 'استوديو الهندسة والتصميم' : 'Engineering & Design Studio'}
                  </span>
                  <h4 style={{ color: 'var(--white)', fontSize: '1.25rem', fontWeight: 700 }}>
                    Aura Nest Architecture
                  </h4>
                </div>
                <div 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    color: 'var(--white)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {isRtl ? 'معايير هندسية عالمية' : 'Global Engineering Standards'}
                </div>
              </div>
            </div>

            {/* Floating Glass Badge */}
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              style={{
                position: 'absolute',
                top: '-15px',
                right: isRtl ? '-15px' : 'auto',
                left: isRtl ? 'auto' : '-15px',
                backgroundColor: 'var(--white)',
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(161, 154, 140, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                zIndex: 2,
                flexDirection: isRtl ? 'row' : 'row'
              }}
            >
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--ivory)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--primary-gold)'
                }}
              >
                <Compass size={22} style={{ color: 'var(--primary-gold)' }} />
              </div>
              <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: 600 }}>
                  {isRtl ? 'دقة في التنفيذ والتسليم' : 'Precision in Execution & Delivery'}
                </div>
              </div>
            </motion.div>

            {/* Floating Golden Accent Behind Image */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: isRtl ? '20px' : '-20px',
                right: isRtl ? '-20px' : '20px',
                bottom: '-20px',
                border: '2px solid var(--primary-gold)',
                borderRadius: '14px',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: 0.7
              }}
              className="about-image-accent"
            />
          </motion.div>

        </div>

        {/* Bottom Section: 5 Distinctive Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          viewport={{ once: true, amount: 0.05 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '3rem' }}
        >
          {/* Subheading */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--light-beige)', paddingBottom: '1.25rem', flexDirection: isRtl ? 'row' : 'row-reverse' }}>
            <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--primary-gold)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                {isRtl ? 'ركائز التفوق' : 'Pillars of Excellence'}
              </span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-charcoal)' }}>
                {isRtl ? 'لماذا يختار النخبة Aura Nest؟' : 'Why Does the Elite Choose Aura Nest?'}
              </h3>
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--warm-gray)', fontWeight: 600 }} className="hide-on-mobile">
              {isRtl ? 'الجودة • الدقة • الالتزام' : 'Quality • Precision • Commitment'}
            </div>
          </div>
          
          {/* Pillars 5 Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {pillars.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="card"
                style={{
                  padding: '2.2rem 1.6rem',
                  backgroundColor: 'var(--white)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '1.2rem',
                  textAlign: isRtl ? 'right' : 'left',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid var(--light-beige)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Watermark Number */}
                <span 
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: isRtl ? '1.2rem' : 'auto',
                    right: isRtl ? 'auto' : '1.2rem',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'rgba(161, 154, 140, 0.12)',
                    fontFamily: 'var(--font-sans)',
                    pointerEvents: 'none',
                    lineHeight: 1
                  }}
                >
                  {item.number}
                </span>

                {/* Icon Container */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(161, 154, 140, 0.25)',
                    boxShadow: '0 4px 12px rgba(63, 64, 66, 0.04)'
                  }}
                >
                  {item.icon}
                </div>

                {/* Text Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <h4 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--dark-charcoal)', lineHeight: '1.4' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-gray)', lineHeight: '1.65' }}>
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Gold Line Accent on Hover */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, var(--primary-gold), transparent)',
                    opacity: 0.8
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
      
      <style>{`
        @media (min-width: 768px) {
          .about-pillars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
