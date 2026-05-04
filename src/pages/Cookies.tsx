import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Cookie, Info, Lock, Settings, Check, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const CookiesPage = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    personalization: true
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookie-preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    localStorage.setItem('cookies-consent', 'accepted');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'essential') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6">
              <ShieldCheck className="w-4 h-4" />
              Privacy & Trust Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1b2533] mb-6 tracking-tight">
              Cookie Policy & Preferences
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              We value your privacy. Learn how we use cookies to improve your experience and manage your preferences below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Navigation/Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-[#1b2533] mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-600" />
                  Quick Info
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">Transparency</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      All cookies used on MADE-IN-US.COM are documented and serve a specific purpose.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">Control</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      You can change your preferences at any time through this page.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-50">
                    <button className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                      Full Privacy Policy <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Preferences */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-lg p-8 md:p-10">
                <h2 className="text-2xl font-bold text-[#1b2533] mb-8">Manage Your Cookies</h2>
                
                <div className="space-y-10">
                  {/* Essential */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-[#1b2533]">Essential Cookies</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.
                      </p>
                    </div>
                    <div className="shrink-0 pt-2">
                      <Switch checked={true} disabled={true} />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                          <Settings className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-[#1b2533]">Analytics Cookies</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.
                      </p>
                    </div>
                    <div className="shrink-0 pt-2">
                      <Switch 
                        checked={preferences.analytics} 
                        onCheckedChange={() => togglePreference('analytics')}
                      />
                    </div>
                  </div>

                  {/* Personalization */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                          <Cookie className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-[#1b2533]">Personalization Cookies</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.
                      </p>
                    </div>
                    <div className="shrink-0 pt-2">
                      <Switch 
                        checked={preferences.personalization} 
                        onCheckedChange={() => togglePreference('personalization')}
                      />
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                          <Check className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-[#1b2533]">Marketing Cookies</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
                      </p>
                    </div>
                    <div className="shrink-0 pt-2">
                      <Switch 
                        checked={preferences.marketing} 
                        onCheckedChange={() => togglePreference('marketing')}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <p className="text-xs text-gray-400 max-w-xs text-center sm:text-left font-medium uppercase tracking-wide">
                    Last updated: March 31, 2026
                  </p>
                  <Button 
                    onClick={handleSave}
                    className="w-full sm:w-auto h-12 px-10 bg-[#1b2533] hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    {saved ? (
                      <>
                        <Check className="w-5 h-5" />
                        Preferences Saved!
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiesPage;
