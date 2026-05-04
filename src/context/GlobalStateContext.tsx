import React, { createContext, useContext, useState, useEffect } from 'react';

import { languages, translatePage } from '@/lib/i18n';

interface GlobalStateContextType {
  isShippingModalOpen: boolean;
  openShippingModal: () => void;
  closeShippingModal: () => void;
  isCookiesBannerForced: boolean;
  openCookiesBanner: () => void;
  closeCookiesBanner: () => void;
  activeLang: typeof languages[0];
  handleLanguageSelect: (lang: typeof languages[0]) => void;
  currency: 'USD' | 'EUR';
  exchangeRate: number; // 1 USD = X Currency
  handleCurrencyChange: (curr: 'USD' | 'EUR') => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isCookiesBannerForced, setIsCookiesBannerForced] = useState(false);

  const openShippingModal = () => setIsShippingModalOpen(true);
  const closeShippingModal = () => setIsShippingModalOpen(false);

  const openCookiesBanner = () => setIsCookiesBannerForced(true);
  const closeCookiesBanner = () => setIsCookiesBannerForced(false);

  const [activeLang, setActiveLang] = useState(languages[0]);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const code = googtrans.split('/').pop();
      const lang = languages.find(l => l.code === code);
      if (lang) setActiveLang(lang);
    }

    // Load saved currency
    const savedCurrency = localStorage.getItem('app_currency') as 'USD' | 'EUR';
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'EUR')) {
      handleCurrencyChange(savedCurrency);
    }
  }, []);

  const handleLanguageSelect = (lang: typeof languages[0]) => {
    setActiveLang(lang);
    translatePage(lang.code);
  };

  const handleCurrencyChange = async (curr: 'USD' | 'EUR') => {
    setCurrency(curr);
    localStorage.setItem('app_currency', curr);
    
    if (curr === 'USD') {
      setExchangeRate(1);
    } else {
      try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR');
        const data = await response.json();
        if (data.rates && data.rates.EUR) {
          setExchangeRate(data.rates.EUR);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback rate if API fails
        setExchangeRate(0.92);
      }
    }
  };

  return (
    <GlobalStateContext.Provider 
      value={{ 
        isShippingModalOpen, 
        openShippingModal, 
        closeShippingModal,
        isCookiesBannerForced,
        openCookiesBanner,
        closeCookiesBanner,
        activeLang,
        handleLanguageSelect,
        currency,
        exchangeRate,
        handleCurrencyChange
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
