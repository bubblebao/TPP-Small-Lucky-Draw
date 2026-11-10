import React from 'react';

export const PavilionsLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 select-none shrink-0">
      {/* Official Crisp Logo Badge */}
      <div className="w-10 h-10 rounded-full p-0.5 bg-white shadow-sm border-2 border-[#698A9A]/30 shrink-0 overflow-hidden">
        <img
          src="/assets/pavilions-logo-official.jpg"
          alt="The Pavilions Phuket Hotels & Resorts Logo"
          className="w-full h-full object-contain rounded-full"
        />
      </div>

      {/* Clean Hotel Branding */}
      <div className="flex flex-col justify-center whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className="font-serif tracking-[0.16em] text-base font-black text-[#2C3E50]">
            THE PAVILIONS
          </span>
          <span className="text-[10px] font-extrabold bg-[#E2EDF0] text-[#44595B] px-2 py-0.5 rounded-full border border-[#698A9A]/40 uppercase">
            Phuket
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#698A9A] font-bold">
          Hotels & Resorts
        </span>
      </div>
    </div>
  );
};

