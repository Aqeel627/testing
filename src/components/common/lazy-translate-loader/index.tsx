// components/common/lazy-translate-loader.tsx
'use client';

import { useEffect } from 'react';

export default function LazyTranslateLoader() {
  useEffect(() => {
    const loadScript = () => {
      if (document.getElementById('google-translate-script')) return;
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=TranslateInit';
      document.body.appendChild(script);
    };

    // ✅ Agar user pehle se koi language select kar chuka hai (cookie set hai)
    // Tab page reload pe bhi script load karni hogi
    const hasCookie = document.cookie.includes('googtrans');
    if (hasCookie) {
      loadScript();
      return;
    }

    // ✅ Warna sirf tab load karo jab user language button pe hover/click kare
    const trigger = document.getElementById('languageToggler');
    if (!trigger) return;

    const onInteract = () => {
      loadScript();
      trigger.removeEventListener('mouseenter', onInteract);
      trigger.removeEventListener('click', onInteract);
    };

    trigger.addEventListener('mouseenter', onInteract);
    trigger.addEventListener('click', onInteract);

    return () => {
      trigger.removeEventListener('mouseenter', onInteract);
      trigger.removeEventListener('click', onInteract);
    };
  }, []);

  return null;
}