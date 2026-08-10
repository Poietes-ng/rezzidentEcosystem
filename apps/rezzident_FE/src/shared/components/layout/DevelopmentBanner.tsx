import { useState } from 'react';


export function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#1a1a1a] text-white px-10 py-2.5 relative z-[10020] flex items-center justify-center w-full">
      <div className="flex items-center gap-3 text-[13px] md:text-sm font-cabinet font-medium text-center pr-8 md:pr-0">
        <span className="material-symbols-outlined text-[16px] text-[#FF6730] shrink-0 hidden md:block">info</span>
        <p className="text-white/90">
          <span className="text-[#FF6730] font-semibold">Notice:</span> This platform is currently under active development. You may experience frequent updates and structural changes.
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Dismiss development notice"
      >
        <span className="material-symbols-outlined text-[16px] text-white/70 hover:text-white">close</span>
      </button>
    </div>
  );
}
