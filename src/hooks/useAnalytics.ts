import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnalytics(endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT ?? '/api/analytics') {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const payload = JSON.stringify({
      type: 'page_view',
      path: `${location.pathname}${location.search}${location.hash}`,
      title: document.title,
      referrer: document.referrer || null,
      timestamp: new Date().toISOString(),
    });

    const target = endpoint.startsWith('http') ? endpoint : new URL(endpoint, window.location.origin).toString();

    if (navigator.sendBeacon) {
      navigator.sendBeacon(target, new Blob([payload], { type: 'application/json' }));
      return;
    }

    void fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [endpoint, location.hash, location.pathname, location.search]);
}
