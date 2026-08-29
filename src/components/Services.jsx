import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Hammer, Building, Palette, Layers, ClipboardCheck } from 'lucide-react';

function ServiceCard({ service, idx, cardVariants }) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: '-15% 0px -15% 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      custom={idx}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={cardVariants}
      className={`card service-card ${isActive ? 'active-viewport-highlight' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--white)',
        textAlign: 'right',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {/* Image Container with hover zoom */}
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
        <img
          src={service.image}
          alt={service.title}
          className="service-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />
      </div>

      {/* Text details content */}
      <div
        style={{
          position: 'relative',
          padding: '2.25rem 1.75rem 2rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          flexGrow: 1
        }}
      >
        {/* Floating Overlapping Icon Circle */}
        <div
          style={{
            position: 'absolute',
            top: '-23px',
            right: '24px',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid rgba(161, 154, 140, 0.15)',
            zIndex: 5
          }}
        >
          {service.icon}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--dark-charcoal)'
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.94rem',
            color: 'var(--text-gray)',
            lineHeight: '1.6',
            margin: 0
          }}
        >
          {service.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const servicesList = [
    {
      icon: <Ruler size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التصميم المعماري والإنشائي',
      desc: 'صياغة مخططات معمارية وإنشائية مبتكرة تواكب جماليات العمارة الحديثة، مع رقابة ميدانية صارمة لضمان مطابقة التنفيذ للمواصفات المعتمدة.',
      image: '/service_architecture.jpg'
    },
    {
      icon: <Palette size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'الديكور والتصميم الداخلي',
      desc: 'ابتكار ديكورات داخلية حصرية تجمع بين الفخامة والعملية، باستخدام خامات فاخرة وتوزيع مدروس للإضاءة والمساحات.',
      image: '/service_interior.jpg'
    },
    {
      icon: <Layers size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'الواجهات والتشطيبات الخارجية',
      desc: 'تصميم وتنفيذ واجهات معمارية راقية تضفي طابع الفخامة على المبنى، بمتانة وقدرة فائقة على تحمل العوامل الجوية.',
      image: '/service_facades.jpg'
    },
    {
      icon: <Hammer size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'المقاولات والتنفيذ المتكامل',
      desc: 'تنفيذ متكامل لأعمال البناء بدءًا من الهياكل الخرسانية والأساسات، مع الالتزام بأعلى معايير السلامة والجودة.',
      image: '/service_contracting_new.jpg'
    },
    {
      icon: <ClipboardCheck size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'كشف 4×4 العقاري',
      desc: 'فحص دقيق يغطي سلامة الهيكل الإنشائي والمعماري، والتدقيق المالي والتراخيص، ومراجعة قانونية للعقود قبل الشراء.',
      image: '/service_inspection_new.jpg'
    },
    {
      icon: <Building size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التسويق العقاري والاستشارات الاستثمارية',
      desc: 'حلول تسويقية مبتكرة تُبرز القيمة الحقيقية للعقار وتضمن سرعة الاستثمار، مع خطة خروج استثمارية متكاملة.',
      image: '/service_marketing_new.jpg'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.06,
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1]
      }
    })
  };

  return (
    <section id="services" className="section-padding" style={{ backgroundColor: 'var(--light-beige)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-subtitle">خدماتنا</span>
          <h2 className="section-main-title">منظومة هندسية شاملة تصيغ أسلوب حياتك</h2>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {servicesList.map((service, idx) => (
            <ServiceCard 
              key={idx} 
              service={service} 
              idx={idx} 
              cardVariants={cardVariants} 
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Desktop Hover & Viewport Focus Highlights */
        @media (min-width: 992px) {
          .service-card {
            border: 1px solid var(--light-beige) !important;
          }
          .service-card.active-viewport-highlight, .service-card:hover {
            border-color: var(--primary-gold) !important;
            box-shadow: var(--shadow-lg) !important;
            transform: translateY(-8px) !important;
          }
          .service-card.active-viewport-highlight .service-image, .service-card:hover .service-image {
            transform: scale(1.06);
          }
        }
        
        /* Mobile/Tablet Viewport Focus Highlights */
        @media (max-width: 991px) {
          .service-card.active-viewport-highlight {
            border-color: var(--primary-gold) !important;
            box-shadow: var(--shadow-md) !important;
            transform: translateY(-3px) !important;
          }
          .service-card.active-viewport-highlight .service-image {
            transform: scale(1.04);
          }
        }
      `}</style>
    </section>
  );
}
