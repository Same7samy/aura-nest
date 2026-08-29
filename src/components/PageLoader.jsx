import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function PageLoader() {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loader on page transition
    setIsLoading(true);

    // Instant scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.97,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--dark-charcoal)',
            zIndex: 9999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              textAlign: 'center'
            }}
          >
            {/* Both logo images combined together in one unit, centered from start */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Logo height={55} showText={true} isWhite={true} vertical={true} />
            </motion.div>

            {/* Gold Progress Accent Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
              style={{
                width: '140px',
                height: '2px',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginTop: '0.5rem',
                position: 'relative'
              }}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                style={{
                  width: '70px',
                  height: '100%',
                  backgroundColor: 'var(--primary-gold)',
                  boxShadow: '0 0 10px var(--primary-gold)'
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
