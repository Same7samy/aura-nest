import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Send, Mail } from 'lucide-react';
import { getContactInfo, fetchContactInfoFromSupabase } from '../utils/projectData';

export default function ContactForm() {
  const [contactData, setContactData] = useState(getContactInfo());

  useEffect(() => {
    fetchContactInfoFromSupabase().then(data => {
      if (data) setContactData(data);
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'التصميم المعماري الإبداعي والإشراف الهندسي وإدارة التنفيذ'
  });
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
    if (!formData.name.trim()) newErrors.name = 'يرجى إدخال الاسم';
    if (!formData.phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف';
    } else if (!/^[0-9+ \-\(\)]{8,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'يرجى إدخال رقم هاتف صحيح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Compile message for WhatsApp
    const formattedText = `السلام عليكم Aura Nest،
أود الاستفسار عن خدماتكم الهندسية.
بيانات التواصل:
- الاسم: ${formData.name.trim()}
- رقم الهاتف: ${formData.phone.trim()}
- الخدمة المطلوبة: ${formData.service}`;

    // Encode text and redirect to WhatsApp link
    const waNumber = contactData.whatsapp || '201111014008'; // International format for Egypt (+20)
    const encodedText = encodeURIComponent(formattedText);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
 
    // Open link in a new tab
    window.open(waUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'العنوان',
      desc: contactData.address
    },
    {
      icon: <Phone size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'الهاتف / واتساب',
      desc: contactData.phone,
      link: contactData.phoneLink
    },
    {
      icon: <Mail size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'البريد الإلكتروني',
      desc: contactData.email,
      link: contactData.emailLink
    },
    {
      icon: <Clock size={24} style={{ color: 'var(--primary-gold)' }} />,
      title: 'ساعات العمل',
      desc: contactData.hours
    }
  ];

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--ivory)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div className="section-title-wrapper" style={{ textAlign: 'right', marginBottom: '3.5rem' }}>
          <span className="section-subtitle" style={{ right: 0, left: 'auto', transform: 'none' }}>تواصل معنا</span>
          <h2 className="section-main-title">تواصل معنا لبدء تنفيذ مشروعك</h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-gray)', marginTop: '0.5rem' }}>
            فريقنا الاستشاري متأهب للإجابة عن تساؤلاتكم وجدولة زيارة استكشافية للموقع للتخطيط الأولي.
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
                  textAlign: 'right'
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
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--dark-charcoal)', fontWeight: 700 }}>
                    {info.title}
                  </h4>
                  {info.link ? (
                    <a
                      href={info.link}
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
                    <p style={{ fontSize: '0.98rem', color: 'var(--text-gray)', fontWeight: 500 }}>
                      {info.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Contact & Social Icons */}
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-start', marginTop: '0.5rem', paddingRight: '0.5rem' }}>
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
                title="اتصال هاتفي"
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
                title="واتساب"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.489 4.936 1.49 5.428-.002 9.85-4.423 9.853-9.856.001-2.633-1.02-5.107-2.875-6.964C16.647 1.966 14.18 .943 11.545.943c-5.43 0-9.854 4.42-9.858 9.853-.002 1.8.476 3.55 1.388 5.105L2.036 22l6.236-1.636zM15.97 12.9c-.228-.115-1.353-.667-1.562-.743-.21-.076-.362-.115-.515.115-.152.23-.59.743-.723.897-.133.153-.266.172-.494.057-.228-.114-.962-.355-1.833-1.132-.678-.605-1.136-1.353-1.27-1.582-.132-.228-.014-.351.1-.465.103-.103.228-.266.342-.4.114-.133.152-.228.228-.38.076-.153.038-.285-.019-.4-.057-.115-.515-1.24-.704-1.696-.185-.445-.37-.384-.515-.39-.133-.007-.285-.007-.438-.007-.152 0-.4.057-.61.285-.21.23-.798.78-.798 1.902 0 1.12.817 2.202.93 2.355.115.152 1.61 2.457 3.9 3.447.545.235.97.376 1.302.482.548.174 1.047.15 1.442.09.44-.067 1.353-.553 1.543-1.085.19-.533.19-1.01.133-1.086-.057-.076-.21-.115-.438-.23z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/"
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
                title="إنستجرام"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1Q51A4NmPs/"
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
                title="فيسبوك"
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
                border: '1px solid var(--light-beige)'
              }}
            >
              <h3 style={{ fontSize: '1.35rem', color: 'var(--dark-charcoal)', fontWeight: 700, marginBottom: '1.5rem', borderRight: '3px solid var(--primary-gold)', paddingRight: '0.75rem' }}>
                طلب استشارة هندسية
              </h3>
              
              <form onSubmit={handleWhatsAppSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="name" className="form-label">الاسم</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="مثال: أحمد محمد"
                    className="form-control"
                    style={{ borderColor: errors.name ? '#e74c3c' : 'var(--light-beige)' }}
                  />
                  {errors.name && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                </div>

                {/* Phone */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="phone" className="form-label">رقم الهاتف</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="مثال: 01111014008"
                    className="form-control"
                    style={{ borderColor: errors.phone ? '#e74c3c' : 'var(--light-beige)' }}
                  />
                  {errors.phone && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>}
                </div>

                {/* Service Selection Dropdown */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="service" className="form-label">الخدمة المطلوبة</label>
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
                      backgroundPosition: 'left 1rem center',
                      backgroundSize: '1.1em',
                      paddingLeft: '2.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="التصميم المعماري الإبداعي والإشراف الهندسي وإدارة التنفيذ">التصميم المعماري الإبداعي والإشراف الهندسي وإدارة التنفيذ</option>
                    <option value="المقاولات والأعمال الإنشائية">المقاولات والأعمال الإنشائية</option>
                    <option value="التسويق والاستشارات العقارية">التسويق والاستشارات العقارية</option>
                    <option value="هندسة الديكور والتصميم الداخلي">هندسة الديكور والتصميم الداخلي</option>
                    <option value="التشطيبات الخارجية والواجهات">التشطيبات الخارجية والواجهات</option>
                    <option value="كشف 4×4 العقاري قبل الشراء">كشف 4×4 العقاري قبل الشراء</option>
                    <option value="أخرى / استشارة عامة">أخرى / استشارة عامة</option>
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
                    justifyContent: 'center'
                  }}
                >
                  <Send size={18} style={{ marginLeft: '0.5rem', transform: 'rotate(180deg)' }} />
                  إرسال عبر واتساب
                </button>
              </form>
            </div>
          </motion.div>

        </div>
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
