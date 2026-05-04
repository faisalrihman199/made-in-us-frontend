import { useState } from 'react';
import { ChevronDown, Check, DollarSign, Euro } from 'lucide-react';
import { useGlobalState } from '@/context/GlobalStateContext';

interface Props {
  variant?: 'light' | 'dark';
  direction?: 'down' | 'up';
}

const currencies = [
  { code: 'USD', label: 'USD ($)', icon: DollarSign },
  { code: 'EUR', label: 'EUR (€)', icon: Euro },
] as const;

export function CurrencySwitcher({ variant = 'light', direction = 'down' }: Props) {
  const [open, setOpen] = useState(false);
  const { currency, handleCurrencyChange } = useGlobalState();

  const isLight = variant === 'light';
  const activeCurrency = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <div className="relative inline-block ml-2">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-sm transition-all
          ${isLight
            ? 'border-gray-200 text-[#334155] hover:bg-gray-50 hover:border-gray-300 bg-white'
            : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white bg-white/5'
          }`}
      >
        <activeCurrency.icon className={`w-4 h-4 ${isLight ? 'text-[#2f884d]' : 'text-[#60e677]'}`} />
        <span>{activeCurrency.code}</span>
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
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => { handleCurrencyChange(curr.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left
                  ${curr.code === currency
                    ? isLight ? 'text-[#2f884d] bg-green-50/50' : 'text-[#60e677] bg-white/5'
                    : isLight ? 'text-[#334155] hover:bg-gray-50' : 'text-white/60 hover:bg-white/5'
                  }`}
              >
                <curr.icon className={`w-4 h-4 ${curr.code === currency ? (isLight ? 'text-[#2f884d]' : 'text-[#60e677]') : (isLight ? 'text-gray-400' : 'text-white/30')}`} />
                <span className="text-[14px] font-bold">{curr.label}</span>
                {curr.code === currency && (
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
