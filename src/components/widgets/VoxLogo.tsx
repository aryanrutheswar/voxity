'use client';

import React from 'react';

interface VoxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTextNextToCircle?: boolean;
}

export function VoxLogo({ size = 'md', showTextNextToCircle = false }: VoxLogoProps) {
  // Dimension mappings - Enlarged size proportions for maximum visual impact
  const circleSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const vTextSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
  };

  const oxTextSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[11px]',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
  };

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Iconic Vox.ity Yellow Circle Logo matching user screenshot */}
      <div
        className={`${circleSizes[size]} rounded-full bg-[#FFE600] flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0 overflow-hidden`}
      >
        <span className="font-serif font-black text-black tracking-tighter leading-none flex items-baseline select-none px-1">
          <span className={`${vTextSizes[size]} font-black`}>V</span>
          <span className={`${oxTextSizes[size]} font-bold`}>o</span>
          <span className={`${oxTextSizes[size]} font-bold italic mr-0.5`}>x</span>
          <span className={`${subTextSizes[size]} font-extrabold font-sans`}>.ity</span>
        </span>
      </div>

      {showTextNextToCircle && (
        <span className="font-serif font-black text-black tracking-tight text-2xl sm:text-3xl">
          Vox<span className="font-serif italic font-bold">.ity</span>
        </span>
      )}
    </div>
  );
}
