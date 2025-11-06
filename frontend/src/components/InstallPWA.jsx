import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") console.log("PWA installiert 🎉");
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
      <button
          onClick={handleInstall}
          className="
      fixed bottom-6 right-6
      bg-purple-600
      text-white dark:text-black
      text-lg md:text-xl
      px-5 py-3
      rounded-full shadow-lg
      hover:bg-purple-700 dark:hover:bg-purple-500
      transition
      font-semibold
    "
      >
        📱 Install App
      </button>
  );


}
