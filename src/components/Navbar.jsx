import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Home, Info, Briefcase, Grid, PhoneCall, ChevronLeft, MessageSquare } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    { id: 'hero', name: 'الرئيسية', icon: <Home size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'about', name: 'من نحن', icon: <Info size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'services', name: 'خدماتنا', icon: <Briefcase size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'portfolio', name: 'أعمالنا', icon: <Grid size={20} style={{ color: 'var(--primary-gold)' }} /> },
    { id: 'contact', name: 'تواصل معنا', icon: <PhoneCall size={20} style={{ color: 'var(--primary-gold)' }} /> }
  ];

  const handleScrollTo = (id) => {
    setIsOpen(false);
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
        <div className="container">
          {/* Logo */}
          <div style={{ cursor: 'pointer' }} onClick={() => handleScrollTo('hero')}>
            <Logo height={44} isWhite={isLogoWhite} />
          </div>

          {/* Desktop Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem', padding: 0, margin: 0 }}>
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
                padding: '0.6rem 1.5rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              <Phone size={14} />
              <span>اتصل بنا</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. MOBILE ONLY HEADER (Visible on screens < 992px) */}
      <header
        className={`mobile-header hide-on-desktop ${scrolled ? 'scrolled' : ''} ${isSubpage ? 'subpage-header' : ''}`}
      >
        <div className="mobile-container">
          {/* Logo restored as images */}
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => handleScrollTo('hero')}>
            <Logo height={28} isWhite={false} />
          </div>

          {/* Mobile Hamburger Menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-hamburger-btn"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
            overflowY: 'auto'
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
                  textAlign: 'right',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

                {/* Arrow icon */}
                <ChevronLeft size={18} style={{ color: 'var(--primary-gold)', opacity: 0.8 }} />
              </button>
            ))}
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
                boxShadow: 'var(--shadow-gold)'
              }}
            >
              <MessageSquare size={20} />
              <span>تواصل عبر واتساب مباشر</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
