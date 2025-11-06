import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import type { Currency, Network, YenPaymentMethod } from '../types/order';

interface ProcessingProps {
  onSuccess: () => void;
  onFailed: () => void;
  language: 'en' | 'ja' | 'zh';
  currency?: Currency;
  network?: Network;
  yenMethod?: YenPaymentMethod;
}

export function Processing({ onSuccess, onFailed, language, currency, network, yenMethod }: ProcessingProps) {
  const [step, setStep] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // Progress through steps
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 2500),
      setTimeout(() => onSuccess(), 4000)
    ];

    // Show timeout options after 30s (for demo, using 10s)
    const timeoutTimer = setTimeout(() => setShowTimeout(true), 10000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(timeoutTimer);
    };
  }, [onSuccess]);

  const isCryptoPayment = !!currency;
  const subtitle = isCryptoPayment 
    ? (language === 'en' ? `Verifying on ${network} network` : 
       language === 'ja' ? `${network} ネットワークで検証中` : 
       `在${network}网络上验证`)
    : (language === 'en' ? 'Confirming payment' : 
       language === 'ja' ? 'お支払いを確認しています' : 
       '确认支付中');

  const text = {
    en: {
      title: 'Processing your payment...',
      subtitle: subtitle,
      initiated: 'Initiated',
      confirmed: 'Confirmed',
      completed: 'Completed',
      refresh: 'Refresh Quote',
      switch: 'Switch Method'
    },
    ja: {
      title: 'お支払い処理中...',
      subtitle: subtitle,
      initiated: '送信完了',
      confirmed: '承認済み',
      completed: '決済完了',
      refresh: 'レートを更新',
      switch: '支払い方法を変更'
    },
    zh: {
      title: '正在处理您的支付...',
      subtitle: subtitle,
      initiated: '已启動',
      confirmed: '已確認',
      completed: '已完成',
      refresh: '刷新报价',
      switch: '切換方式'
    }
  };

  const t = text[language];

  const coinSymbol = currency === 'USDC' ? '$' : currency === 'JPYC' ? '¥' : '¥';

  const steps = [
    { label: t.initiated, index: 0 },
    { label: t.confirmed, index: 1 },
    { label: t.completed, index: 2 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] items-center justify-center px-6 py-8">
      {/* Rotating Crypto Coin */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className="mb-6 relative"
      >
        <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${
          currency === 'USDC' ? 'from-[#00C2A8] to-[#00A890]' : 'from-green-500 to-green-600'
        } flex items-center justify-center shadow-2xl`}>
          <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
            <span className="text-3xl">{coinSymbol}</span>
          </div>
        </div>
        
        {/* Glow effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 rounded-full ${
            currency === 'USDC' ? 'bg-[#00C2A8]/30' : 'bg-green-500/30'
          } blur-2xl`}
        />
      </motion.div>

      <h2 className="text-2xl text-slate-900 mb-2">{t.title}</h2>
      <p className="text-slate-500 mb-8">{t.subtitle}</p>

      {/* Progress Timeline */}
      <div className="w-full max-w-xs mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200">
            <motion.div
              className="h-full bg-[#00C2A8]"
              initial={{ width: '0%' }}
              animate={{ width: step >= 2 ? '100%' : step >= 1 ? '50%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {steps.map((s, index) => (
            <div key={s.label} className="flex flex-col items-center z-10 bg-[#F7F9FB] px-2">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  step >= index 
                    ? 'bg-[#00C2A8] text-white' 
                    : 'bg-slate-200 text-slate-400'
                }`}
                animate={step === index ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: step === index ? Infinity : 0 }}
              >
                {step > index ? '✓' : index + 1}
              </motion.div>
              <span className={`text-xs ${
                step >= index ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeout Options */}
      {showTimeout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs space-y-3"
        >
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-200 active:scale-95 transition-transform"
          >
            {t.refresh}
          </Button>
          
          <Button 
            onClick={onFailed}
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-200 active:scale-95 transition-transform"
          >
            {t.switch}
          </Button>
        </motion.div>
      )}
    </div>
  );
}