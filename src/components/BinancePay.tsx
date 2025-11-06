import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface BinancePayProps {
  onSuccess: () => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
}

export function BinancePay({ onSuccess, onBack, language }: BinancePayProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);
  const merchantBinanceId = '392847561';

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

  const handleCopy = () => {
    // Use fallback method that works in all environments
    const textArea = document.createElement('textarea');
    textArea.value = merchantBinanceId;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Silently fail - still show copied state for better UX
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const text = {
    en: {
      opening: 'Opening Binance App...',
      merchantId: 'Merchant Binance ID',
      copyId: 'Copy ID',
      copied: 'Copied!',
      didntOpen: 'Didn\'t open automatically?',
      openManual: 'Open Binance App manually',
      tryAnother: 'Try another method'
    },
    ja: {
      opening: 'Binance アプリを起動しています...',
      merchantId: '加盟店 Binance ID',
      copyId: 'IDをコピー',
      copied: 'コピーしました！',
      didntOpen: 'アプリが起動しない場合',
      openManual: 'Binance アプリを手動で開く',
      tryAnother: '別のお支払い方法を選ぶ'
    },
    zh: {
      opening: '正在打开Binance应用...',
      merchantId: '商家 Binance ID',
      copyId: '复制ID',
      copied: '已复制！',
      didntOpen: '未自动打开？',
      openManual: '手动打开Binance应用',
      tryAnother: '尝试其他方式'
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
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Rotating Binance Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FFD34E] to-[#FFC107] flex items-center justify-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-slate-900 mb-6"
        >
          {t.opening}
        </motion.h2>

        {/* Merchant ID Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
            <p className="text-sm text-slate-500 mb-2">{t.merchantId}</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-xl text-slate-900 tracking-wider tabular-nums">
                {merchantBinanceId}
              </code>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white active:scale-95 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    {t.copyId}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Fallback Modal */}
        {showFallback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm mt-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <p className="text-slate-700 mb-6 text-center">{t.didntOpen}</p>
              
              <div className="space-y-3">
                <Button 
                  onClick={onSuccess}
                  className="w-full h-12 rounded-xl bg-[#FFD34E] hover:bg-[#FFC107] text-slate-900 shadow-md active:scale-95 transition-transform"
                >
                  {t.openManual}
                </Button>
                
                <Button 
                  onClick={onBack}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-slate-200 active:scale-95 transition-transform"
                >
                  {t.tryAnother}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
