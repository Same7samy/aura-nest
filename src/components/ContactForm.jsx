import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Send, Mail } from 'lucide-react';
import { getContactInfo, fetchContactInfoFromSupabase } from '../utils/projectData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export default function ContactForm() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [contactData, setContactData] = useState(getContactInfo());

  useEffect(() => {
    fetchContactInfoFromSupabase().then(data => {
      if (data) setContactData(data);
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: ''
  });

  // Keep selected service in sync with active language
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      service: isRtl 
        ? 'التصميم المعماري الإبداعي والإشراف الهندسي وإدارة التنفيذ' 
        : 'Creative Architectural Design, Engineering Supervision & Execution'
    }));
  }, [lang]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = isRtl ? 'يرجى إدخال الاسم' : 'Please enter your name';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = isRtl ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number';
    } else if (!/^[0-9+ \-\(\)]{8,20}$/.test(formData.phone.trim())) {
      newErrors.phone = isRtl ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Compile message for WhatsApp
    const formattedText = isRtl 
      ? `السلام عليكم Aura Nest،
أود الاستفسار عن خدماتكم الهندسية.
بيانات التواصل:
- الاسم: ${formData.name.trim()}
- رقم الهاتف: ${formData.phone.trim()}
- الخدمة المطلوبة: ${formData.service}`
      : `Hello Aura Nest,
I would like to inquire about your engineering services.
Contact Info:
- Name: ${formData.name.trim()}
- Phone: ${formData.phone.trim()}
- Requested Service: ${formData.service}`;

    // Encode text and redirect to WhatsApp link
    const waNumber = contactData.whatsapp || '201111014008';
    const encodedText = encodeURIComponent(formattedText);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
 
    window.open(waUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: isRtl ? 'العنوان' : 'Address',
      desc: (!isRtl && contactData.addressEn) ? contactData.addressEn : contactData.address,
      link: contactData.mapUrl || "https://maps.app.goo.gl/w8LWXW5MVBr7z9rs7",
      isExternal: true,
      buttonText: t.mapButton
    },
    {
      icon: <Phone size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: isRtl ? 'الهاتف / واتساب' : 'Phone / WhatsApp',
      desc: contactData.phone,
      link: contactData.phoneLink
    },
    {
      icon: <Mail size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: isRtl ? 'البريد الإلكتروني' : 'Email Address',
      desc: contactData.email,
      link: contactData.emailLink
    },
    {
      icon: <Clock size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: isRtl ? 'ساعات العمل' : 'Working Hours',
      desc: (!isRtl && contactData.hoursEn) ? contactData.hoursEn : contactData.hours
    }
  ];

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--ivory)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div className="section-title-wrapper" style={{ textAlign: isRtl ? 'right' : 'left', marginBottom: '3.5rem' }}>
          <span className="section-subtitle" style={{ right: isRtl ? 0 : 'auto', left: isRtl ? 'auto' : 0, transform: 'none' }}>
            {t.navContact}
          </span>
          <h2 className="section-main-title">
            {isRtl ? 'تواصل معنا لبدء تنفيذ مشروعك' : 'Contact Us to Begin Your Project'}
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-gray)', marginTop: '0.5rem' }}>
            {isRtl 
              ? 'فريقنا الاستشاري متأهب للإجابة عن تساؤلاتكم وجدولة زيارة استكشافية للموقع للتخطيط الأولي.'
              : 'Our consulting team is ready to answer your inquiries and schedule an exploratory site visit for layout planning.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem', alignItems: 'start' }} className="contact-grid">
          
          {/* Contact Details Column */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: true, amount: 0.05 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="card glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.75rem 1.5rem',
                  textAlign: isRtl ? 'right' : 'left',
                  flexDirection: isRtl ? 'row' : 'row'
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--light-beige)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(161, 154, 140, 0.2)',
                    flexShrink: 0
                  }}
                >
                  {info.icon}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: isRtl ? 'right' : 'left' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--dark-charcoal)', fontWeight: 700 }}>
                    {info.title}
                  </h4>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={info.isExternal ? "_blank" : undefined}
                      rel={info.isExternal ? "noopener noreferrer" : undefined}
                      style={{
                        fontSize: '0.98rem',
                        color: 'var(--text-gray)',
                        textDecoration: 'none',
                        transition: 'color var(--transition-fast)',
                        fontWeight: 600
                      }}
                      className="contact-link"
                    >
                      {info.desc}
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.98rem', color: 'var(--text-gray)', fontWeight: 500, margin: 0 }}>
                      {info.desc}
                    </p>
                  )}
                  {info.buttonText && (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--primary-gold)',
                        backgroundColor: 'var(--light-beige)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        marginTop: '0.4rem',
                        width: 'fit-content',
                        transition: 'all 0.2s ease'
                      }}
                      className="contact-map-btn"
                    >
                      <MapPin size={13} />
                      <span>{info.buttonText}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Contact & Social Icons */}
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-start', marginTop: '0.5rem', paddingRight: isRtl ? '0.5rem' : '0', paddingLeft: isRtl ? '0' : '0.5rem' }}>
              {/* Call */}
              <a
                href={contactData.phoneLink || "tel:01111014008"}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1px solid rgba(161, 154, 140, 0.25)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-gold)',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-gold)';
                  e.currentTarget.style.color = 'var(--white)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--white)';
                  e.currentTarget.style.color = 'var(--primary-gold)';
                  e.currentTarget.style.transform = 'none';
                }}
                title={isRtl ? "اتصال هاتفي" : "Phone Call"}
              >
                <Phone size={19} />
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${contactData.whatsapp || '201111014008'}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1px solid rgba(161, 154, 140, 0.25)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#25D366',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#25D366';
                  e.currentTarget.style.color = 'var(--white)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--white)';
                  e.currentTarget.style.color = '#25D366';
                  e.currentTarget.style.transform = 'none';
                }}
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.489 4.936 1.49 5.428-.002 9.85-4.423 9.853-9.856.001-2.633-1.02-5.107-2.875-6.964C16.647 1.966 14.18 .943 11.545.943c-5.43 0-9.854 4.42-9.858 9.853-.002 1.8.476 3.55 1.388 5.105L2.036 22l6.236-1.636zM15.97 12.9c-.228-.115-1.353-.667-1.562-.743-.21-.076-.362-.115-.515.115-.152.23-.59.743-.723.897-.133.153-.266.172-.494.057-.228-.114-.962-.355-1.833-1.132-.678-.605-1.136-1.353-1.27-1.582-.132-.228-.014-.351.1-.465.103-.103.228-.266.342-.4.114-.133.152-.228.228-.38.076-.153.038-.285-.019-.4-.057-.115-.515-1.24-.704-1.696-.185-.445-.37-.384-.515-.39-.133-.007-.285-.007-.438-.007-.152 0-.4.057-.61.285-.21.23-.798.78-.798 1.902 0 1.12.817 2.202.93 2.355.115.152 1.61 2.457 3.9 3.447.545.235.97.376 1.302.482.548.174 1.047.15 1.442.09.44-.067 1.353-.553 1.543-1.085.19-.533.19-1.01.133-1.086-.057-.076-.21-.115-.438-.23z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={contactData.facebook || "https://instagram.com/"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1px solid rgba(161, 154, 140, 0.25)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E1306C',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E1306C';
                  e.currentTarget.style.color = 'var(--white)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--white)';
                  e.currentTarget.style.color = '#E1306C';
                  e.currentTarget.style.transform = 'none';
                }}
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={contactData.facebook || "https://www.facebook.com/share/1Q51A4NmPs/"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1px solid rgba(161, 154, 140, 0.25)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1877F2',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F2';
                  e.currentTarget.style.color = 'var(--white)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--white)';
                  e.currentTarget.style.color = '#1877F2';
                  e.currentTarget.style.transform = 'none';
                }}
                title="Facebook"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.95z"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: true, amount: 0.05 }}
          >
            <div
              className="card"
              style={{
                padding: '2.5rem',
                backgroundColor: 'var(--white)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--light-beige)',
                textAlign: isRtl ? 'right' : 'left'
              }}
            >
              <h3 
                style={{ 
                  fontSize: '1.35rem', 
                  color: 'var(--dark-charcoal)', 
                  fontWeight: 700, 
                  marginBottom: '1.5rem', 
                  borderRight: isRtl ? '3px solid var(--primary-gold)' : 'none', 
                  borderLeft: isRtl ? 'none' : '3px solid var(--primary-gold)', 
                  paddingRight: isRtl ? '0.75rem' : '0', 
                  paddingLeft: isRtl ? '0' : '0.75rem' 
                }}
              >
                {isRtl ? 'طلب استشارة هندسية' : 'Engineering Consultation Request'}
              </h3>
              
              <form onSubmit={handleWhatsAppSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name */}
                <div className="form-group" style={{ margin: 0, textAlign: isRtl ? 'right' : 'left' }}>
                  <label htmlFor="name" className="form-label">{isRtl ? 'الاسم الكامل*' : 'Full Name*'}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={isRtl ? 'مثال: أحمد محمد' : 'e.g. John Doe'}
                    className="form-control"
                    style={{ 
                      borderColor: errors.name ? '#e74c3c' : 'var(--light-beige)',
                      textAlign: isRtl ? 'right' : 'left'
                    }}
                  />
                  {errors.name && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                </div>

                {/* Phone */}
                <div className="form-group" style={{ margin: 0, textAlign: isRtl ? 'right' : 'left' }}>
                  <label htmlFor="phone" className="form-label">{isRtl ? 'رقم الهاتف*' : 'Phone Number*'}</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={isRtl ? 'مثال: 01111014008' : 'e.g. +201111014008'}
                    className="form-control"
                    style={{ 
                      borderColor: errors.phone ? '#e74c3c' : 'var(--light-beige)',
                      textAlign: 'left',
                      direction: 'ltr'
                    }}
                  />
                  {errors.phone && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>}
                </div>

                {/* Service Selection Dropdown */}
                <div className="form-group" style={{ margin: 0, textAlign: isRtl ? 'right' : 'left' }}>
                  <label htmlFor="service" className="form-label">{isRtl ? 'الخدمة المطلوبة' : 'Requested Service'}</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{
                      borderColor: 'var(--light-beige)',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8884' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: isRtl ? 'left 1rem center' : 'right 1rem center',
                      backgroundSize: '1.1em',
                      paddingLeft: isRtl ? '2.5rem' : '1rem',
                      paddingRight: isRtl ? '1rem' : '2.5rem',
                      cursor: 'pointer',
                      textAlign: isRtl ? 'right' : 'left',
                      fontFamily: 'var(--font-arabic)'
                    }}
                  >
                    {isRtl ? (
                      <>
                        <option value="التصميم المعماري الإبداعي والإشراف الهندسي وإدارة التنفيذ">التصميم المعماري الإبداعي والإشراف الهندسي وإدارة التنفيذ</option>
                        <option value="المقاولات والأعمال الإنشائية">المقاولات والأعمال الإنشائية</option>
                        <option value="التسويق والاستشارات العقارية">التسويق والاستشارات العقارية</option>
                        <option value="هندسة الديكور والتصميم الداخلي">هندسة الديكور والتصميم الداخلي</option>
                        <option value="التشطيبات الخارجية والواجهات">التشطيبات الخارجية والواجهات</option>
                        <option value="كشف 4×4 العقاري قبل الشراء">كشف 4×4 العقاري قبل الشراء</option>
                        <option value="أخرى / استشارة عامة">أخرى / استشارة عامة</option>
                      </>
                    ) : (
                      <>
                        <option value="Creative Architectural Design, Engineering Supervision & Execution">Creative Architectural Design, Engineering Supervision & Execution</option>
                        <option value="General Contracting & Construction">General Contracting & Construction</option>
                        <option value="Real Estate Marketing & Consulting">Real Estate Marketing & Consulting</option>
                        <option value="Interior Design & Decoration">Interior Design & Decoration</option>
                        <option value="Exterior Facades & Finishes">Exterior Facades & Finishes</option>
                        <option value="4x4 Property Inspection prior to purchase">4x4 Property Inspection prior to purchase</option>
                        <option value="Other / General Consultation">Other / General Consultation</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    marginTop: '0.5rem',
                    justifyContent: 'center',
                    flexDirection: isRtl ? 'row' : 'row'
                  }}
                >
                  <Send 
                    size={18} 
                    style={{ 
                      marginLeft: isRtl ? '0.5rem' : '0', 
                      marginRight: isRtl ? '0' : '0.5rem', 
                      transform: isRtl ? 'rotate(180deg)' : 'none' 
                    }} 
                  />
                  <span>{isRtl ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}</span>
                </button>
              </form>
            </div>
          </motion.div>

        </div>

        {/* Embedded Interactive Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          viewport={{ once: true, amount: 0.05 }}
          style={{ marginTop: '3.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-charcoal)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <MapPin size={20} style={{ color: 'var(--primary-gold)' }} />
              <span>{isRtl ? 'موقعنا التفاعلي على الخريطة' : 'Our Interactive Location Map'}</span>
            </h3>
            <a
              href={contactData.mapUrl || "https://maps.app.goo.gl/w8LWXW5MVBr7z9rs7"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{
                fontSize: '0.82rem',
                padding: '0.4rem 0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none'
              }}
            >
              <MapPin size={14} />
              <span>{t.mapButton}</span>
            </a>
          </div>

          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(161, 154, 140, 0.25)',
              position: 'relative',
              height: '380px',
              width: '100%',
              backgroundColor: 'var(--white)'
            }}
            className="map-embed-wrapper"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221051.00105986843!2d31.63434785798197!3d30.039098637800425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583dd017550959%3A0x42cef18df8f6e14!2sAura%20Nest!5e0!3m2!1sar!2seg!4v1788472134199!5m2!1sar!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Aura Nest Google Map"
            />
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 0.9fr 1.1fr !important;
          }
        }
        .contact-link:hover {
          color: var(--primary-gold) !important;
        }
      `}</style>
    </section>
  );
}
