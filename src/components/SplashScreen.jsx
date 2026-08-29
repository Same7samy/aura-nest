import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Start transition to hide after 1.1s
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 1100);

    // Unmount after 1.5s
    const removeTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!animationStarted && (
        <motion.div
          key="splash"
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
              transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
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
