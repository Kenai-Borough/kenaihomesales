import { Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const shouldRender = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024 && !isStandalone() && !dismissed;
  }, [dismissed]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!deferredPrompt || !shouldRender) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome !== 'accepted') setDismissed(true);
    setDeferredPrompt(null);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] rounded-[28px] border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:hidden">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-cyan-400/10 p-2 text-cyan-300">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Add to Home Screen</p>
          <p className="mt-1 text-sm text-slate-300">Install Kenai Home Sales for faster mobile browsing, offline-ready assets, and direct access to saved homes.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={() => setDismissed(true)}>
              Not now
            </button>
            <button type="button" className="btn-primary px-4 py-2 text-xs" onClick={() => void handleInstall()}>
              Install app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
