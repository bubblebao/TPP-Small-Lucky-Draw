import React from 'react';

interface PavilionsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PavilionsLogo: React.FC<PavilionsLogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className="flex items-center space-x-3.5 select-none">
      {/* Official Crisp Logo Badge */}
      <div
        className={`relative ${sizeClasses[size]} flex-shrink-0 rounded-full p-0.5 bg-white shadow-md border-2 border-[#698A9A]/30 overflow-hidden hover:scale-105 transition-transform`}
      >
        <img
          src="/assets/pavilions-logo-official.jpg"
          alt="The Pavilions Phuket Hotels & Resorts Official Logo"
          className="w-full h-full object-contain rounded-full"
        />
      </div>

      {/* Luxury Hotel Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-2">
          <span className="font-serif tracking-[0.16em] text-base sm:text-lg font-black text-[#2C3E50]">
            THE PAVILIONS
          </span>
          <span className="text-[10px] font-extrabold bg-[#E2EDF0] text-[#44595B] px-2 py-0.5 rounded-full border border-[#698A9A]/40 uppercase">
            Phuket
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#698A9A] font-bold">
            Hotels & Resorts
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8FA3]" />
          <span className="text-[10px] uppercase tracking-wider text-[#E07A5F] font-extrabold">
            Board Room
          </span>
        </div>
      </div>
    </div>
  );
};
