// lib/useCookieConsent.ts
"use client";

import { useState, useEffect } from "react";

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp?: string;
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      const parsed = JSON.parse(consent);
      setPreferences(parsed);
      setHasConsented(true);
    }
  }, []);

  const canUseAnalytics = preferences?.analytics ?? false;
  const canUseMarketing = preferences?.marketing ?? false;
  const canUseFunctional = preferences?.functional ?? false;

  return {
    preferences,
    hasConsented,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional,
  };
}
