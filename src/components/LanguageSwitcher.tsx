import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

import { languages } from '@/lib/i18n';

/* -----------------------------------------------
   Variant: "light"  → used in the Header (white bg)
   Variant: "dark"   → used in the Footer (dark bg)
   direction: "down" | "up" → which way the dropdown opens
------------------------------------------------ */
interface Props {
  variant?: 'light' | 'dark';
  direction?: 'down' | 'up';
  activeLang: typeof languages[0];
  onSelect: (lang: typeof languages[0]) => void;
}

export function LanguageSwitcher({ variant = 'light', direction = 'down', activeLang, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const isLight = variant === 'light';

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-sm transition-all
          ${isLight
            ? 'border-gray-200 text-[#334155] hover:bg-gray-50 hover:border-gray-300 bg-white'
            : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white bg-white/5'
          }`}
      >
        <img src={activeLang.flag} alt={activeLang.label} className="w-5 h-auto rounded-sm shadow-sm" />
        <span>{activeLang.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isLight ? 'text-gray-400' : 'text-white/40'}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-44 rounded-xl shadow-2xl overflow-hidden z-50
              animate-in fade-in duration-150
              ${direction === 'up' ? 'slide-in-from-bottom-1' : 'slide-in-from-top-1'}
              ${isLight ? 'bg-white border border-gray-100' : 'bg-[#162318] border border-white/10'}`}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onSelect(lang); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left
                  ${lang.code === activeLang.code
                    ? isLight ? 'text-[#2f884d] bg-green-50/50' : 'text-[#60e677] bg-white/5'
                    : isLight ? 'text-[#334155] hover:bg-gray-50' : 'text-white/60 hover:bg-white/5'
                  }`}
              >
                <img src={lang.flag} alt={lang.label} className="w-5 h-auto rounded-sm shadow-sm" />
                <span className="text-[14px] font-bold">{lang.label}</span>
                {lang.code === activeLang.code && (
                  <Check className={`w-4 h-4 ml-auto ${isLight ? 'text-[#2f884d]' : 'text-[#60e677]'}`} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
