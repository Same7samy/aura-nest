import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Home, Info, Briefcase, Grid, PhoneCall, ChevronLeft, MessageSquare, Globe } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export default function Navbar() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/control') {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollPos > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', name: t.navHome, icon: <Home size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'about', name: t.navAbout, icon: <Info size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'services', name: t.navServices, icon: <Briefcase size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'portfolio', name: t.navPortfolio, icon: <Grid size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'contact', name: t.navContact, icon: <PhoneCall size={20} style={{ color: 'var(--primary-gold)' }} /> }
  ];

  const handleScrollTo = (elementId) => {
    setIsOpen(false);
    if (location.pathname !== '/' && location.pathname !== '/index.html') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
      return;
    }

    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isSubpage = location.pathname !== '/' && location.pathname !== '/index.html';
  const textColor = (isSubpage && !scrolled) ? '#FFFFFF' : 'var(--dark-charcoal)';
  const isLogoWhite = isSubpage && !scrolled;

  return (
    <>
      {/* 1. DESKTOP ONLY HEADER (Visible on screens >= 992px) */}
      <header
        className={`desktop-header hide-on-mobile ${scrolled ? 'scrolled' : ''} ${isSubpage ? 'subpage-header' : ''}`}
        style={{
          backgroundColor: scrolled ? 'rgba(246, 244, 238, 0.95)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(161, 154, 140, 0.15)' : 'none',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Logo */}
          <div style={{ cursor: 'pointer' }} onClick={() => handleScrollTo('hero')}>
            <Logo height={44} isWhite={isLogoWhite} />
          </div>

          {/* Desktop Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '1.5rem', padding: 0, margin: 0 }}>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleScrollTo(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: textColor,
                      cursor: 'pointer',
                      position: 'relative',
                      padding: '0.25rem 0',
                      fontFamily: 'var(--font-arabic)',
                      transition: 'color var(--transition-fast)'
                    }}
                    className="nav-link-btn"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <a
              href="https://wa.me/201111014008"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              <Phone size={13} />
              <span>{t.navCallUs}</span>
            </a>

            {/* Premium Language Switcher */}
            <button
              onClick={toggleLanguage}
              style={{
                background: 'none',
                border: scrolled || isSubpage ? `1px solid ${textColor}` : '1px solid rgba(255, 255, 255, 0.4)',
                color: textColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                padding: '0.45rem 0.8rem',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                transition: 'all 0.25s',
                fontFamily: 'Outfit, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-gold)';
                e.currentTarget.style.color = 'var(--white)';
                e.currentTarget.style.borderColor = 'var(--primary-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textColor;
                e.currentTarget.style.borderColor = scrolled || isSubpage ? textColor : 'rgba(255, 255, 255, 0.4)';
              }}
            >
              <Globe size={13} />
              <span>{t.navLangToggle}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE ONLY HEADER (Visible on screens < 992px) */}
      <header
        className={`mobile-header hide-on-desktop ${scrolled ? 'scrolled' : ''} ${isSubpage ? 'subpage-header' : ''}`}
      >
        <div className="mobile-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
          {/* Logo */}
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => handleScrollTo('hero')}>
            <Logo height={28} isWhite={isLogoWhite} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Mobile Language Switcher in header */}
            <button
              onClick={toggleLanguage}
              style={{
                background: 'none',
                border: scrolled || isSubpage ? `1px solid ${textColor}` : '1px solid rgba(255, 255, 255, 0.4)',
                color: textColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.35rem 0.6rem',
                borderRadius: '4px',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              <Globe size={12} />
              <span>{t.navLangToggle}</span>
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-hamburger-btn"
              style={{ color: textColor }}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. LUXURY MOBILE MENU DRAWER OVERLAY */}
      {isOpen && (
        <div
          className="mobile-drawer"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(246, 244, 238, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 1.25rem 2rem 1.25rem',
            overflowY: 'auto',
            direction: isRtl ? 'rtl' : 'ltr'
          }}
        >
          {/* Drawer Top Header (Logo + Close Button) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(161, 154, 140, 0.18)',
              marginBottom: '2rem'
            }}
          >
            <div style={{ cursor: 'pointer' }} onClick={() => handleScrollTo('hero')}>
              <Logo height={34} isWhite={false} />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(63, 64, 66, 0.08)',
                border: '1px solid rgba(63, 64, 66, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--dark-charcoal)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flexGrow: 1 }}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--white)',
                  border: '1px solid rgba(161, 154, 140, 0.15)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  textAlign: isRtl ? 'right' : 'left',
                  transition: 'all 0.25s ease',
                  flexDirection: isRtl ? 'row' : 'row-reverse'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRtl ? 'row' : 'row' }}>
                  {/* Icon Circle */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--ivory)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(161, 154, 140, 0.12)',
                      flexShrink: 0
                    }}
                  >
                    {link.icon}
                  </div>

                  {/* Title */}
                  <span
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--dark-charcoal)',
                      fontFamily: 'var(--font-arabic)'
                    }}
                  >
                    {link.name}
                  </span>
                </div>

                {/* Arrow icon rotated based on direction */}
                <ChevronLeft 
                  size={18} 
                  style={{ 
                    color: 'var(--primary-gold)', 
                    opacity: 0.8,
                    transform: isRtl ? 'none' : 'rotate(180deg)'
                  }} 
                />
              </button>
            ))}

            {/* Mobile Drawer Language Switcher */}
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--white)',
                border: '1px solid rgba(161, 154, 140, 0.15)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                textAlign: isRtl ? 'right' : 'left',
                marginTop: '0.85rem',
                flexDirection: isRtl ? 'row' : 'row-reverse'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRtl ? 'row' : 'row' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(161, 154, 140, 0.12)',
                    flexShrink: 0,
                    color: 'var(--primary-gold)'
                  }}
                >
                  <Globe size={20} />
                </div>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--dark-charcoal)',
                    fontFamily: 'var(--font-arabic)'
                  }}
                >
                  {isRtl ? 'English (EN)' : 'العربية (AR)'}
                </span>
              </div>
              <ChevronLeft 
                size={18} 
                style={{ 
                  color: 'var(--primary-gold)', 
                  opacity: 0.8,
                  transform: isRtl ? 'none' : 'rotate(180deg)'
                }} 
              />
            </button>
          </div>

          {/* Drawer Bottom CTA Button */}
          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(161, 154, 140, 0.18)' }}>
            <a
              href="https://wa.me/201111014008"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-gold)',
                flexDirection: isRtl ? 'row' : 'row'
              }}
            >
              <MessageSquare size={20} />
              <span>{isRtl ? 'تواصل عبر واتساب مباشر' : 'Contact via WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
