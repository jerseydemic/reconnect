"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if user has dismissed the prompt recently
    const dismissedUntil = localStorage.getItem("pwa-install-dismissed");
    const now = Date.now();
    if (dismissedUntil && parseInt(dismissedUntil) > now) {
      return; // Don't show if dismissed within the last 7 days
    }

    // For Android/Chrome - listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS - show custom instructions if not already installed
    if (ios && !standalone && !dismissedUntil) {
      // Show after a short delay to not overwhelm on first load
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
    // For iOS, the instructions are already shown
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("pwa-install-dismissed", sevenDaysFromNow.toString());
  };

  // Don't show if already installed or dismissed
  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          {isIOS ? (
            <Share className="w-6 h-6 mt-1 flex-shrink-0" />
          ) : (
            <Download className="w-6 h-6 mt-1 flex-shrink-0" />
          )}
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Add ReConnect to Your Home Screen
            </h3>
            {isIOS ? (
              <p className="text-sm opacity-90">
                Tap the <Share className="inline w-4 h-4 mx-1" /> share button below, then select
                &quot;Add to Home Screen&quot; for the best experience.
              </p>
            ) : (
              <p className="text-sm opacity-90">
                Install ReConnect for quick access and a better experience!
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isIOS && (
              <Button
                onClick={handleInstallClick}
                size="sm"
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Install
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
