'use client';

import React from 'react';

interface ShinyBottomBorderProps {
  children: React.ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export default function ShinyBottomBorder({
  children,
  color = '#67e8f9',
  intensity = 'high',
  className = '',
}: ShinyBottomBorderProps) {
  const intensityConfig = {
    low: { height: '3px', blur: '4px', spread: '30px' },
    medium: { height: '4px', blur: '6px', spread: '60px' },
    high: { height: '5px', blur: '8px', spread: '90px' },
  };

  const config = intensityConfig[intensity];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}

      {/* Shiny Glow Layer */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '110%', // slightly wider for natural spread
          height: config.height,
          background: `linear-gradient(90deg, 
            transparent 15%,
            ${color} 35%,
            white 50%,
            ${color} 65%,
            transparent 85%
          )`,
          boxShadow: `
            0 0 15px ${color},
            0 0 35px ${color},
            0 0 ${config.spread} ${color}80
          `,
          filter: `blur(${config.blur})`,
          opacity: intensity === 'high' ? 0.95 : 0.85,
        }}
      />

      {/* Extra Center Bloom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '45%',
          maxWidth: '700px',
          height: '12px',
          background: 'white',
          filter: 'blur(12px)',
          opacity: 0.6,
        }}
      />
    </div>
  );
}