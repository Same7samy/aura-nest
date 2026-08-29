import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import PageLoader from './components/PageLoader';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active-viewport-highlight');
          } else {
            entry.target.classList.remove('active-viewport-highlight');
          }
        });
      },
      {
        threshold: 0.4, // Activates when 40% of the card is visible in the viewport
        rootMargin: '-10% 0px -10% 0px' // Viewport offset margin for reading focus
      }
    );

    // Dynamic mutation observer to track newly added cards on navigation
    const mutationObserver = new MutationObserver(() => {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => observer.observe(card));
    });

    // Start observing DOM changes for dynamic rendering
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Initial query
    const initialCards = document.querySelectorAll('.card');
    initialCards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Scroll-bound Golden Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3.5px',
          background: 'linear-gradient(90deg, var(--primary-gold) 0%, #D4AF37 50%, var(--primary-gold) 100%)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 100000,
          boxShadow: '0 1px 12px rgba(212, 175, 55, 0.5)'
        }}
      />
      <PageLoader />
      <SplashScreen />
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/control" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
      
      <FloatingWhatsApp />
    </BrowserRouter>
  );
}

function FloatingWhatsApp() {
  const location = useLocation();
  if (location.pathname === '/control') return null;
  return (
    <a
      href="https://wa.me/201111014008"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9999,
        width: '56px',
        height: '56px',
        backgroundColor: 'var(--primary-gold)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(161, 154, 140, 0.35)',
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
        e.currentTarget.style.backgroundColor = 'var(--dark-charcoal)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(63, 64, 66, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.backgroundColor = 'var(--primary-gold)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(161, 154, 140, 0.35)';
      }}
      title="تواصل معنا عبر واتساب"
      className="whatsapp-float-btn"
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="currentColor"
        style={{ color: '#fff' }}
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.489 4.936 1.49 5.428-.002 9.85-4.423 9.853-9.856.001-2.633-1.02-5.107-2.875-6.964C16.647 1.966 14.18 .943 11.545.943c-5.43 0-9.854 4.42-9.858 9.853-.002 1.8.476 3.55 1.388 5.105L2.036 22l6.236-1.636zM15.97 12.9c-.228-.115-1.353-.667-1.562-.743-.21-.076-.362-.115-.515.115-.152.23-.59.743-.723.897-.133.153-.266.172-.494.057-.228-.114-.962-.355-1.833-1.132-.678-.605-1.136-1.353-1.27-1.582-.132-.228-.014-.351.1-.465.103-.103.228-.266.342-.4.114-.133.152-.228.228-.38.076-.153.038-.285-.019-.4-.057-.115-.515-1.24-.704-1.696-.185-.445-.37-.384-.515-.39-.133-.007-.285-.007-.438-.007-.152 0-.4.057-.61.285-.21.23-.798.78-.798 1.902 0 1.12.817 2.202.93 2.355.115.152 1.61 2.457 3.9 3.447.545.235.97.376 1.302.482.548.174 1.047.15 1.442.09.44-.067 1.353-.553 1.543-1.085.19-.533.19-1.01.133-1.086-.057-.076-.21-.115-.438-.23z" />
      </svg>
    </a>
  );
}
