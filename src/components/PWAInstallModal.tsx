import React from 'react';
import { Download, X, Share2, PlusSquare, CheckCircle2, Smartphone } from 'lucide-react';
import { AppLanguage } from '../types';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  lang: AppLanguage;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  lang,
}) => {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        onClose();
      } catch (err) {
        console.error('Error triggering PWA prompt:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-6 text-slate-800 dark:text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-4">
            <Smartphone className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold">
            {lang === 'ug' ? 'تېلېفونغا ئەپ قىلىپ قاچىلاش' : 'Install MinngYardamqim App'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ug'
              ? 'بۇ بېكەتنى تېلېفونىڭىزغا قاچىلىۋالسىڭىز، تورسىز ھالەتتىمۇ تېز ئېچىلىدۇ ھەم ئۈستەل يۈزىدە ئايرىم ئەپ بولۇپ تۇرىدۇ.'
              : 'Install this app on your device for instant launch and offline access.'}
          </p>

          {isStandalone ? (
            <div className="mt-5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ug' ? 'سىستېما ئاللىقاچان ئەپ قىلىپ قاچىلاندى!' : 'Already installed as an app!'}</span>
            </div>
          ) : deferredPrompt ? (
            <div className="mt-5 w-full">
              <button
                onClick={handleNativeInstall}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ug' ? 'ھازىرلا قاچىلاش' : 'Install Now'}</span>
              </button>
            </div>
          ) : isIOS ? (
            <div className="mt-5 text-right w-full bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs space-y-2.5">
              <p className="font-bold text-slate-700 dark:text-slate-200">
                {lang === 'ug' ? 'iPhone / iPad (Safari) قاچىلاش ئۇسۇلى:' : 'For iOS Safari:'}
              </p>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Share2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{lang === 'ug' ? '1. تۆۋەندىكى «ھەمبەھىرلەش» (Share) سىنبەلگىسىنى بېسىڭ' : '1. Tap the Share icon'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <PlusSquare className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{lang === 'ug' ? '2. تىزىملىكتىن «ئاساسىي ئېكرانغا قوشۇش» (Add to Home Screen) نى بېسىڭ' : '2. Select "Add to Home Screen"'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'ug' ? '3. ئوڭ يۇقىرىدىكى «قوشۇش» نى بېسىپ تاماملFill:' : '3. Tap "Add" at the top-right'}</span>
              </div>
            </div>
          ) : (
            <div className="mt-5 text-right w-full bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs space-y-2">
              <p className="font-bold text-slate-700 dark:text-slate-200">
                {lang === 'ug' ? 'تور كۆرگۈچتىن قاچىلاش:' : 'Browser Install:'}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {lang === 'ug'
                  ? 'تور كۆرگۈچىڭىزنىڭ ئوڭ ئۈستى تەرىپىدىكى ئۈچ چېكىت (⋮) تىزىملىكىنى ئېچىپ، «ئەپ قىلىپ ئورنىتىش» ياكى «ئاساسىي ئېكرانغا قوشۇش» نى تاللاڭ.'
                  : 'Open your browser menu (⋮) and tap "Install app" or "Add to Home Screen".'}
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {lang === 'ug' ? 'تاقاش' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
