import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, FileText, Hammer, Paintbrush, ShieldCheck, Building } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      number: '01',
      icon: <MapPin size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'اختيار الأرض والموقع',
      desc: 'دراسة وتحديد الأرض المثالية وتقييم موقعها استثمارياً وجغرافياً للتأكد من ملاءمتها للمشروع المستهدف.'
    },
    {
      number: '02',
      icon: <Compass size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'تصاميم معمارية وإنشائية',
      desc: 'صياغة المخططات الهندسية الإبداعية والإنشائية التفصيلية التي تلبي معايير الجمال وتضمن أقصى متانة للمبنى.'
    },
    {
      number: '03',
      icon: <FileText size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'استخراج التراخيص والموافقات',
      desc: 'إنهاء كافة المعاملات الحكومية واستخراج التراخيص الإنشائية والموافقات اللازمة من الأجهزة المختصة لبدء العمل قانونياً.'
    },
    {
      number: '04',
      icon: <Hammer size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التنفيذ المطابق للتراخيص',
      desc: 'إطلاق أعمال البناء وتشييد الهياكل الخرسانية بدقة هندسية صارمة وتطابق تام مع التراخيص والرسومات المعتمدة.'
    },
    {
      number: '05',
      icon: <Paintbrush size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التشطيب الراقي والممتد',
      desc: 'تنفيذ التشطيبات الداخلية والخارجية الفاخرة وتركيب أحدث التجهيزات والأنظمة بأعلى معايير الرقي.'
    },
    {
      number: '06',
      icon: <ShieldCheck size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'الفحص والتسليم النهائي',
      desc: 'إجراء الاختبارات الهندسية ومراجعة دقة جودة التشطيبات وفحص الأنظمة بالكامل قبل التسليم النهائي للمفتاح.'
    },
    {
      number: '07',
      icon: <Building size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'التسويق والاستثمار العقاري',
      desc: 'إعداد استراتيجية عرض وترويج مبتكرة وتسويق وحدات المشروع لضمان خطة خروج استثمارية ناجحة وسريعة.'
    }
  ];

  return (
    <section id="process" className="section-padding" style={{ backgroundColor: 'var(--light-beige)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        {/* Section title */}
        <div className="section-title-wrapper" style={{ textAlign: 'right', marginBottom: '4rem' }}>
          <span className="section-subtitle" style={{ right: 0, left: 'auto', transform: 'none' }}>كيف نعمل</span>
          <h2 className="section-main-title">رحلة التحول: من المفهوم إلى الواقع</h2>
        </div>

        {/* Steps Grid */}
        <div 
          style={{ 
            position: 'relative',
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '2.5rem',
            marginTop: '2rem'
          }}
          className="process-grid"
        >
          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.25, 1, 0.5, 1] }}
              viewport={{ once: true, amount: 0.05 }}
              key={idx}
              className="card process-card"
              style={{
                position: 'relative',
                zIndex: 2,
                backgroundColor: 'var(--white)',
                padding: '2.5rem 2rem',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-sm)',
                borderRight: '4px solid var(--primary-gold)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                textAlign: 'right',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {/* Header: Icon, Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Icon Container */}
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(161, 154, 140, 0.2)'
                  }}
                >
                  {step.icon}
                </div>

                {/* Big Step Number */}
                <span
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: 'rgba(212, 175, 55, 0.25)',
                    fontFamily: 'Outfit, sans-serif',
                    lineHeight: '1'
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Title & Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--dark-charcoal)'
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.94rem',
                    color: 'var(--text-gray)',
                    lineHeight: '1.65',
                    margin: 0
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .process-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .process-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-lg) !important;
            border-right-color: var(--primary-gold) !important;
          }
          .process-card:nth-child(7) {
            grid-column: span 3;
          }
        }
        @media (min-width: 768px) and (max-width: 991px) {
          .process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .process-card:nth-child(7) {
            grid-column: span 2;
          }
        }
      `}</style>
    </section>
  );
}
