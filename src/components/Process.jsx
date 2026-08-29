import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, FileText, Hammer, Paintbrush, ShieldCheck, Building } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export default function Process() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const stepsAr = [
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

  const stepsEn = [
    {
      number: '01',
      icon: <MapPin size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Land & Site Selection',
      desc: 'Studying and selecting the ideal land, evaluating its location from investment and geographic aspects to ensure suitability.'
    },
    {
      number: '02',
      icon: <Compass size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Architectural & Structural Designs',
      desc: 'Formulating creative engineering and detailed structural designs meeting aesthetic criteria while ensuring maximum durability.'
    },
    {
      number: '03',
      icon: <FileText size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Permits & Approvals Acquisition',
      desc: 'Completing government procedures, acquiring construction permits and necessary approvals from relevant authorities to start legally.'
    },
    {
      number: '04',
      icon: <Hammer size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Compliant Execution & Construction',
      desc: 'Launching construction and concrete structures with strict precision, conforming fully to approved licenses and drawings.'
    },
    {
      number: '05',
      icon: <Paintbrush size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Premium & Elite Finishing',
      desc: 'Executing luxury interior and exterior finishes, installing state-of-the-art fixtures and systems under supreme standards.'
    },
    {
      number: '06',
      icon: <ShieldCheck size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Inspection & Final Handover',
      desc: 'Conducting engineering tests, checking finishing quality, and auditing systems completely before final key handover.'
    },
    {
      number: '07',
      icon: <Building size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'Real Estate Marketing & Exit',
      desc: 'Preparing innovative showcase strategies and marketing project units to ensure a successful and rapid investment exit.'
    }
  ];

  const steps = isRtl ? stepsAr : stepsEn;

  return (
    <section id="process" className="section-padding" style={{ backgroundColor: 'var(--light-beige)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        {/* Section title */}
        <div className="section-title-wrapper" style={{ textAlign: isRtl ? 'right' : 'left', marginBottom: '4rem' }}>
          <span className="section-subtitle" style={{ right: isRtl ? 0 : 'auto', left: isRtl ? 'auto' : 0, transform: 'none' }}>
            {isRtl ? 'كيف نعمل' : 'Our Process'}
          </span>
          <h2 className="section-main-title">
            {isRtl ? 'رحلة التحول: من المفهوم إلى الواقع' : 'The Journey: From Concept to Reality'}
          </h2>
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
                borderRight: isRtl ? '4px solid var(--primary-gold)' : 'none',
                borderLeft: isRtl ? 'none' : '4px solid var(--primary-gold)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                textAlign: isRtl ? 'right' : 'left',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {/* Header: Icon, Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row' : 'row' }}>
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

              {/* Text content details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 750,
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
    </section>
  );
}
