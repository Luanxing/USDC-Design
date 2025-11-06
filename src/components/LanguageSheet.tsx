import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Card } from './ui/card';

interface LanguageSheetProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ja' | 'zh';
  setLanguage: (lang: 'en' | 'ja' | 'zh') => void;
  displayCurrency: 'JPY' | 'USD';
  setDisplayCurrency: (currency: 'JPY' | 'USD') => void;
}

export function LanguageSheet({ 
  isOpen, 
  onClose, 
  language, 
  setLanguage, 
  displayCurrency, 
  setDisplayCurrency 
}: LanguageSheetProps) {
  const languages = [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'ja' as const, name: 'Japanese', nativeName: '日本語' },
    { code: 'zh' as const, name: 'Chinese', nativeName: '简体中文' }
  ];

  const currencies = [
    { code: 'JPY' as const, name: 'Japanese Yen', symbol: '¥' },
    { code: 'USD' as const, name: 'US Dollar', symbol: '$' }
  ];

  const text = {
    en: {
      title: 'Language & Currency',
      languageSection: 'Language',
      currencySection: 'Display Currency'
    },
    ja: {
      title: '言語と通貨設定',
      languageSection: '表示言語',
      currencySection: '通貨表示'
    },
    zh: {
      title: '语言和货币',
      languageSection: '语言',
      currencySection: '显示货币'
    }
  };

  const t = text[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[70vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl text-slate-900">{t.title}</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(70vh-120px)]">
              {/* Language Section */}
              <div className="mb-6">
                <h3 className="text-sm text-slate-500 mb-3">{t.languageSection}</h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <Card
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`border rounded-xl p-4 cursor-pointer active:scale-95 transition-all ${
                        language === lang.code 
                          ? 'bg-[#00C2A8]/10 border-[#00C2A8]' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-900">{lang.nativeName}</p>
                          <p className="text-sm text-slate-500">{lang.name}</p>
                        </div>
                        {language === lang.code && (
                          <div className="w-6 h-6 rounded-full bg-[#00C2A8] flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Currency Section */}
              <div className="mb-4">
                <h3 className="text-sm text-slate-500 mb-3">{t.currencySection}</h3>
                <div className="space-y-2">
                  {currencies.map((curr) => (
                    <Card
                      key={curr.code}
                      onClick={() => setDisplayCurrency(curr.code)}
                      className={`border rounded-xl p-4 cursor-pointer active:scale-95 transition-all ${
                        displayCurrency === curr.code 
                          ? 'bg-[#00C2A8]/10 border-[#00C2A8]' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <span className="text-slate-700">{curr.symbol}</span>
                          </div>
                          <div>
                            <p className="text-slate-900">{curr.code}</p>
                            <p className="text-sm text-slate-500">{curr.name}</p>
                          </div>
                        </div>
                        {displayCurrency === curr.code && (
                          <div className="w-6 h-6 rounded-full bg-[#00C2A8] flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
