import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Smartphone, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ApplePayProps {
  onSuccess: () => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
  totalAmount: number;
}

export function ApplePay({ onSuccess, onBack, language, totalAmount }: ApplePayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    // Show Apple Pay sheet after a brief moment
    const timer = setTimeout(() => setShowSheet(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleApplePay = () => {
    setIsProcessing(true);
    // Simulate Apple Pay processing
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const text = {
    en: {
      title: 'Apple Pay',
      subtitle: 'Confirm with Face ID or Touch ID',
      merchant: 'カフェMax',
      amount: 'Amount',
      total: 'Total',
      confirm: 'Double-click to Pay',
      processing: 'Processing...',
      secured: 'Secured by Apple Pay'
    },
    ja: {
      title: 'Apple Pay でお支払い',
      subtitle: 'Face ID または Touch ID で認証',
      merchant: 'カフェMax',
      amount: 'お支払い金額',
      total: 'お会計',
      confirm: 'サイドボタンをダブルクリック',
      processing: '処理中...',
      secured: 'Apple Pay により保護されています'
    },
    zh: {
      title: 'Apple Pay',
      subtitle: '使用Face ID或Touch ID确认',
      merchant: 'カフェMax',
      amount: '金额',
      total: '总计',
      confirm: '双击支付',
      processing: '处理中...',
      secured: 'Apple Pay保护'
    }
  };

  const t = text[language];

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {!showSheet ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-black mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <p className="text-slate-500">{t.processing}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md"
          >
            {/* Apple Pay Sheet */}
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="bg-black text-white p-6 text-center">
                <Smartphone className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-xl">{t.title}</h2>
                <p className="text-sm text-white/70 mt-1">{t.subtitle}</p>
              </div>

              {/* Payment Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t.merchant}</span>
                  <span className="text-slate-900">{t.merchant}</span>
                </div>
                
                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t.amount}</span>
                  <span className="text-slate-900">¥{totalAmount.toLocaleString()}</span>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between">
                  <span className="text-slate-900">{t.total}</span>
                  <span className="text-2xl text-slate-900">¥{totalAmount.toLocaleString()}</span>
                </div>

                {/* Apple Pay Button */}
                <Button
                  onClick={handleApplePay}
                  disabled={isProcessing}
                  className="w-full h-14 bg-black hover:bg-slate-800 text-white rounded-xl mt-6 relative overflow-hidden"
                >
                  {isProcessing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>{t.processing}</span>
                    </motion.div>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5 mr-2" />
                      {t.confirm}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  {t.secured}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
