export const languages = [
  { code: 'en', label: 'English',  flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'es', label: 'Español',  flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'de', label: 'Deutsch',  flag: 'https://flagcdn.com/w40/de.png' },
];

export function translatePage(langCode: string) {
  if (langCode === 'en') {
    const domain = window.location.hostname;
    const domainParts = domain.split('.');
    
    // Comprehensive cookie clearing for googtrans
    const clearCookie = (name: string, domain?: string) => {
      let base = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      if (domain) {
        document.cookie = base + ` domain=${domain}`;
        document.cookie = base + ` domain=.${domain}`;
      } else {
        document.cookie = base;
      }
    };

    // Clear for current hostname
    clearCookie('googtrans');
    clearCookie('googtrans', domain);

    // Clear for root domain if applicable (e.g., example.com for www.example.com)
    if (domainParts.length >= 2) {
      const rootDomain = domainParts.slice(-2).join('.');
      if (rootDomain !== domain) {
        clearCookie('googtrans', rootDomain);
      }
    }

    window.location.reload();
    return;
  }

  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
  }
}
