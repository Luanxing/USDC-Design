import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { SafeCheckoutFooter } from './SafeCheckoutFooter';

interface OrderSummaryProps {
  onProceed: () => void;
  onOpenLanguage: () => void;
  language: 'en' | 'ja' | 'zh';
  displayCurrency: 'JPY' | 'USD';
}

export function OrderSummary({ onProceed, onOpenLanguage, language }: OrderSummaryProps) {
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Reset timer
      setTimeLeft(45);
    }
  }, [timeLeft]);

  const text = {
    en: {
      yourOrder: 'Your order total',
      quote: 'rate updated 12:03 JST',
      refresh: 'Quote refresh in',
      proceed: 'Proceed to Payment',
      change: 'Change currency',
      noFees: 'Zero hidden fees',
      noFeesSub: 'What you see is what you pay'
    },
    ja: {
      yourOrder: 'ご注文合計',
      quote: '12:03 JST レート更新',
      refresh: '見積更新まで',
      proceed: '支払いに進む',
      change: '通貨を変更',
      noFees: '隠れた手数料なし',
      noFeesSub: '表示された金額をお支払いください'
    },
    zh: {
      yourOrder: '您的订单总额',
      quote: '汇率更新于 12:03 JST',
      refresh: '报价刷新倒计时',
      proceed: '前往支付',
      change: '更改货币',
      noFees: '无隐藏费用',
      noFeesSub: '所见即所付'
    }
  };

  const t = text[language];

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#00A890] flex items-center justify-center shadow-md">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900">カフェMax</h1>
            <p className="text-sm text-slate-500">Tokyo, Shibuya</p>
          </div>
        </div>
        <button 
          onClick={onOpenLanguage}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <Globe className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white border-0 shadow-lg rounded-2xl p-6">
            <p className="text-sm text-slate-500 mb-2">{t.yourOrder}</p>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mb-4"
            >
              <div className="text-5xl text-slate-900 mb-2">¥1,000</div>
              <div className="text-xl text-slate-400">≈ 6.61 USDC</div>
              <div className="text-xs text-slate-400 mt-1">{t.quote}</div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div 
              className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm text-slate-500">{t.refresh}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00C2A8] animate-pulse" />
                <span className="text-sm text-slate-900 tabular-nums">
                  00:{String(timeLeft).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          </Card>

          {/* Info Cards */}
          <div className="mt-4 space-y-3">
            <div className="bg-gradient-to-r from-[#00C2A8]/10 to-[#00C2A8]/5 rounded-xl p-4 border border-[#00C2A8]/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00C2A8] flex items-center justify-center flex-shrink-0">
                  <span className="text-white">💰</span>
                </div>
                <div>
                  <p className="text-sm text-slate-700">
                    {t.noFees}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.noFeesSub}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-8 space-y-4">
        <Button 
          onClick={onProceed}
          className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30 active:scale-95 transition-transform"
        >
          {t.proceed}
        </Button>
        
        <button 
          onClick={onOpenLanguage}
          className="w-full text-sm text-[#00C2A8] active:scale-95 transition-transform"
        >
          {t.change}
        </button>

        <SafeCheckoutFooter language={language} />
      </div>
    </div>
  );
}
