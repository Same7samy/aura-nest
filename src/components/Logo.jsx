import React from 'react';

export default function Logo({ className = '', height = 40, showText = true, isWhite = false, vertical = false }) {
  const filterStyle = isWhite ? { filter: 'brightness(0) invert(1)' } : {};
  
  return (
    <div
      className={`select-none ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        gap: vertical ? '0.5rem' : '0.75rem'
      }}
    >
      <img
        src="/logo.png"
        alt="Aura Nest Logo"
        style={{
          height: `${height}px`,
          width: 'auto',
          maxWidth: '180px',
          objectFit: 'contain',
          borderRadius: '4px',
          flexShrink: 0,
          ...filterStyle
        }}
      />
      {showText && (
        <img
          src="/logo-text.png"
          alt="AURA NEST Brand"
          style={{
            height: vertical ? `${height * 0.7}px` : `${height}px`,
            width: 'auto',
            objectFit: 'contain',
            flexShrink: 0,
            ...filterStyle
          }}
        />
      )}
    </div>
  );
}
