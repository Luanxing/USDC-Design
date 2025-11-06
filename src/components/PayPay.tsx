import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface PayPayProps {
  onSuccess: () => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
}

export function PayPay({ onSuccess, onBack, language }: PayPayProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Show fallback after 3 seconds
    const timer = setTimeout(() => setShowFallback(true), 3000);
    
    // Auto-proceed to success after 6 seconds (simulating payment)
    const successTimer = setTimeout(() => onSuccess(), 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(successTimer);
    };
  }, [onSuccess]);

  const text = {
    en: {
      opening: 'Opening PayPay App...',
      didntOpen: 'Didn\'t open automatically?',
      openManual: 'Open PayPay App manually',
      tryAnother: 'Try another method',
      instructions: 'Complete the payment in the PayPay app and return here.'
    },
    ja: {
      opening: 'PayPay アプリを起動しています...',
      didntOpen: 'アプリが起動しない場合',
      openManual: 'PayPay アプリを手動で開く',
      tryAnother: '別のお支払い方法を選ぶ',
      instructions: 'PayPay アプリでお支払いを完了してください。'
    },
    zh: {
      opening: '正在打开PayPay应用...',
      didntOpen: '未自动打开？',
      openManual: '手动打开PayPay应用',
      tryAnother: '尝试其他方式',
      instructions: '在PayPay应用中完成支付后返回此处。'
    }
  };

  const t = text[language];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex-shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
        {/* Rotating PayPay Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF0000] to-[#CC0000] flex items-center justify-center shadow-2xl mb-6"
        >
          <span className="text-white text-4xl">PP</span>
        </motion.div>

        <motion.h2 
          className="text-2xl text-slate-900 mb-2"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {t.opening}
        </motion.h2>

        <p className="text-slate-500 text-center mb-8 max-w-sm">
          {t.instructions}
        </p>

        {/* Progress indicator */}
        <motion.div 
          className="flex gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#FF0000] rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>

        {/* Fallback options */}
        {showFallback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-3"
          >
            <p className="text-sm text-slate-600 text-center mb-4">
              {t.didntOpen}
            </p>
            
            <Button 
              onClick={() => {
                // Simulate opening PayPay with deep link
                window.location.href = 'paypay://';
              }}
              className="w-full h-14 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-2xl"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              {t.openManual}
            </Button>

            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full h-14 rounded-2xl"
            >
              {t.tryAnother}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}