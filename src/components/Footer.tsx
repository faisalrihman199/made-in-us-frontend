import React from 'react';
import { Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useGlobalState } from '@/context/GlobalStateContext';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';

const Footer = () => {
  const navigate = useNavigate();
  const { activeLang, handleLanguageSelect } = useGlobalState();

  const marketplaceLinks = [
    { name: "Our Mission", id: "our-mission" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Buying Guide", id: "buying-a-car" },
    { name: "Subscription", path: "/membership" },
    { name: "Watchlist", path: "/watchlist" },
  ];

  const supportLinks = [
    { name: "Help Center", id: "faq" },
    { name: "Terms of Service", id: "terms" },
    { name: "Privacy Policy", id: "terms" }, // Assuming privacy is in terms for now
    { name: "Cookies", path: "/cookies" },
  ];


  const handleLinkClick = (id: string) => {
    navigate(`/about#${id}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const USLogo = () => (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
      <Link to="/" className="transition-transform hover:scale-105 duration-200">
        <img
          src="/footer_logo.png"
          alt="MADE-IN-US.COM"
          className="h-auto w-[220px] md:w-[320px] lg:w-[420px] object-contain"
        />
      </Link>
    </div>
  );

  return (
    <footer className="bg-[#1b2d1d] text-white/70 py-20 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr,1fr,1fr,1fr] gap-12 lg:gap-20 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <USLogo />
            <div className="space-y-1">
              <p className="text-[14px] text-white/50 font-medium tracking-wide">Secure. Transparent.</p>
              <p className="text-[14px] text-white/50 font-medium tracking-wide">Built for national and international buyers.</p>
            </div>
          </div>

          {/* Marketplace Column */}
          <div>
            <h6 className="text-[14px] font-bold text-[#60e677] uppercase tracking-widest mb-8 border-b border-white/10 pb-2 inline-block">Marketplace</h6>
            <ul className="space-y-4">
              {marketplaceLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => link.path ? navigate(link.path) : handleLinkClick(link.id!)}
                    className="text-[15px] hover:text-[#60e677] transition-all flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#60e677]/40 group-hover:bg-[#60e677] transition-colors" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h6 className="text-[14px] font-bold text-[#60e677] uppercase tracking-widest mb-8 border-b border-white/10 pb-2 inline-block">Support & Legal</h6>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => link.path ? navigate(link.path) : handleLinkClick(link.id!)}
                    className="text-[15px] hover:text-[#60e677] transition-all flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#60e677]/40 group-hover:bg-[#60e677] transition-colors" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div className="lg:text-left">
            <h6 className="text-[14px] font-bold text-[#60e677] uppercase tracking-widest mb-8 border-b border-white/10 pb-2 inline-block">Follow Us</h6>
            <div className="flex items-center gap-6">
              {[
                { Icon: Youtube, href: "https://youtube.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Twitter, href: "https://twitter.com" }
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#60e677]/20 hover:text-[#60e677] transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Copyright */}
            <div className="text-[13px] text-white/30 font-semibold tracking-wide">
              © 2025 MADE-IN-US.COM LLC. ALL RIGHTS RESERVED.
            </div>

            {/* Bottom Navigation & Language */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-6">
                {['Terms', 'Privacy', 'Cookies'].map((item) => (
                  <button
                    key={item}
                    onClick={() => navigate(item === 'Cookies' ? '/cookies' : '/about#terms')}
                    className="text-[13px] text-white/40 hover:text-white transition-colors font-bold uppercase tracking-wider"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <LanguageSwitcher
                  variant="dark"
                  direction="up"
                  activeLang={activeLang}
                  onSelect={handleLanguageSelect}
                />
                <CurrencySwitcher variant="dark" direction="up" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
