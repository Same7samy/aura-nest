import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Phone, MapPin, Heart, Mail } from 'lucide-react';
import { getContactInfo, fetchContactInfoFromSupabase } from '../utils/projectData';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/control') {
    return null;
  }

  const [contactData, setContactData] = useState(getContactInfo());

  useEffect(() => {
    fetchContactInfoFromSupabase().then(data => {
      if (data) setContactData(data);
    });
  }, []);

  const currentYear = new Date().getFullYear();

  const handleScrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
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
    }
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--dark-charcoal)',
        color: 'var(--white)',
        paddingTop: '5rem',
        paddingBottom: '2rem',
        borderTop: '3px solid var(--primary-gold)',
        position: 'relative'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            borderBottom: '1px solid rgba(138, 136, 132, 0.2)',
            paddingBottom: '3.5rem',
            textAlign: 'right'
          }}
          className="footer-grid"
        >
          {/* Logo and Slogan Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Custom styled light logo for dark BG */}
            <div onClick={() => handleScrollTo('hero')} style={{ cursor: 'pointer' }}>
              <Logo showText={true} isWhite={true} />
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--light-beige)', opacity: 0.8, lineHeight: '1.6', maxWidth: '300px' }}>
              منظومة هندسية متكاملة من الفكرة حتى المفتاح — تصميم داخلي، تشطيبات فاخرة، وإشراف هندسي شامل للمساحات السكنية والتجارية.
            </p>
            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', marginTop: '0.25rem' }}>
              <a
                href={contactData.facebook || "https://www.facebook.com/share/1Q51A4NmPs/"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--light-beige)',
                  transition: 'color var(--transition-fast)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--light-beige)'}
                title="تابعنا على فيسبوك"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.95z"/>
                </svg>
              </a>
              <a
                href={contactData.instagram || "https://instagram.com/"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--light-beige)',
                  transition: 'color var(--transition-fast)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--light-beige)'}
                title="تابعنا على إنستجرام"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--white)', fontWeight: 700, borderRight: '2.5px solid var(--primary-gold)', paddingRight: '0.5rem' }}>
              روابط سريعة
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'about', name: 'من نحن' },
                { id: 'services', name: 'خدماتنا' },
                { id: 'portfolio', name: 'أعمالنا' },
                { id: 'contact', name: 'تواصل معنا' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleScrollTo(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--light-beige)',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-arabic)',
                      transition: 'all var(--transition-fast)'
                    }}
                    className="footer-link-btn"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--white)', fontWeight: 700, borderRight: '2.5px solid var(--primary-gold)', paddingRight: '0.5rem' }}>
              معلومات الاتصال
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                <span style={{ fontSize: '0.92rem', color: 'var(--light-beige)', lineHeight: '1.5' }}>
                  {contactData.address}
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} style={{ color: 'var(--primary-gold)', flexShrink: 0 }} />
                <a
                  href={contactData.phoneLink || "tel:01111014008"}
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--light-beige)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    direction: 'ltr',
                    transition: 'color var(--transition-fast)'
                  }}
                  className="footer-phone-link"
                >
                  {contactData.phone}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} style={{ color: 'var(--primary-gold)', flexShrink: 0 }} />
                <a
                  href={contactData.emailLink || "mailto:info@aura-nest.net"}
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--light-beige)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color var(--transition-fast)'
                  }}
                  className="footer-email-link"
                >
                  {contactData.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '2rem',
            fontSize: '0.85rem',
            color: 'var(--warm-gray)'
          }}
          className="footer-bottom-bar"
        >
          <span>
            جميع الحقوق محفوظة © {currentYear} AURA NEST — رؤيتنا تصنع أحلامك
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            بُني بكل إتقان <Heart size={12} style={{ color: 'var(--primary-gold)', fill: 'var(--primary-gold)' }} /> لأجل مساحاتكم الفاخرة
          </span>
        </div>
      </div>

      <style>{`
        .footer-link-btn:hover {
          color: var(--primary-gold) !important;
          transform: translateX(-4px);
        }
        .footer-phone-link:hover,
        .footer-email-link:hover {
          color: var(--primary-gold) !important;
        }
        @media (min-width: 768px) {
          .footer-bottom-bar {
            flex-direction: row-reverse !important;
          }
        }
        /* Custom adjustment of logo text colors for dark bg */
        footer .brand-text {
          color: var(--white) !important;
        }
      `}</style>
    </footer>
  );
}
