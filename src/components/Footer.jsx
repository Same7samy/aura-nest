import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Phone, MapPin, Heart, Mail } from 'lucide-react';
import { getContactInfo, fetchContactInfoFromSupabase } from '../utils/projectData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const isRtl = lang === 'ar';

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
        position: 'relative',
        direction: isRtl ? 'rtl' : 'ltr'
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
            textAlign: isRtl ? 'right' : 'left'
          }}
          className="footer-grid"
        >
          {/* Logo and Slogan Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: isRtl ? 'flex-start' : 'flex-start' }}>
            <div onClick={() => handleScrollTo('hero')} style={{ cursor: 'pointer' }}>
              <Logo showText={true} isWhite={true} />
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--light-beige)', opacity: 0.8, lineHeight: '1.6', maxWidth: '300px' }}>
              {isRtl 
                ? 'منظومة هندسية متكاملة من الفكرة حتى المفتاح — تصميم داخلي، تشطيبات فاخرة، وإشراف هندسي شامل للمساحات السكنية والتجارية.'
                : 'An integrated engineering system from concept to key — interior design, premium finishes, and comprehensive engineering supervision for residential & commercial spaces.'}
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
                title="Facebook"
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
                title="Instagram"
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
            <h4 style={{ 
              fontSize: '1.15rem', 
              color: 'var(--white)', 
              fontWeight: 700, 
              borderRight: isRtl ? '2.5px solid var(--primary-gold)' : 'none', 
              borderLeft: isRtl ? 'none' : '2.5px solid var(--primary-gold)', 
              paddingRight: isRtl ? '0.5rem' : '0',
              paddingLeft: isRtl ? '0' : '0.5rem'
            }}>
              {t.footerNavTitle}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              {[
                { id: 'about', name: t.navAbout },
                { id: 'services', name: t.navServices },
                { id: 'portfolio', name: t.navPortfolio },
                { id: 'contact', name: t.navContact }
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
                      transition: 'all var(--transition-fast)',
                      padding: 0
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
            <h4 style={{ 
              fontSize: '1.15rem', 
              color: 'var(--white)', 
              fontWeight: 700, 
              borderRight: isRtl ? '2.5px solid var(--primary-gold)' : 'none', 
              borderLeft: isRtl ? 'none' : '2.5px solid var(--primary-gold)', 
              paddingRight: isRtl ? '0.5rem' : '0',
              paddingLeft: isRtl ? '0' : '0.5rem'
            }}>
              {t.footerContactTitle}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a
                    href={contactData.mapUrl || "https://maps.app.goo.gl/w8LWXW5MVBr7z9rs7"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--light-beige)',
                      lineHeight: '1.5',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                    className="footer-address-link"
                    title={t.mapTooltip || (isRtl ? 'فتح الموقع على خرائط جوجل' : 'Open location in Google Maps')}
                  >
                    {(!isRtl && contactData.addressEn) ? contactData.addressEn : contactData.address}
                  </a>
                  <a
                    href={contactData.mapUrl || "https://maps.app.goo.gl/w8LWXW5MVBr7z9rs7"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--primary-gold)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      width: 'fit-content',
                      transition: 'all 0.25s ease'
                    }}
                    className="footer-map-btn"
                  >
                    <MapPin size={13} />
                    <span>{t.mapButton}</span>
                  </a>
                </div>
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
            flexDirection: isRtl ? 'row' : 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '2rem',
            fontSize: '0.85rem',
            color: 'var(--warm-gray)',
            flexWrap: 'wrap'
          }}
          className="footer-bottom-bar"
        >
          <span>
            {isRtl 
              ? `جميع الحقوق محفوظة © ${currentYear} AURA NEST — رؤيتنا تصنع أحلامك`
              : `All rights reserved © ${currentYear} AURA NEST — Our vision shapes your dreams`}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {isRtl ? 'صُنع بكل حب وشغف هندسي' : 'Crafted with engineering passion'} <Heart size={12} style={{ color: 'var(--primary-gold)', fill: 'var(--primary-gold)' }} />
          </span>
        </div>
      </div>
    </footer>
  );
}
