import { motion } from 'motion/react';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface FailedProps {
  onRetry: () => void;
  onSwitchMethod: () => void;
  language: 'en' | 'ja' | 'zh';
}

export function Failed({ onRetry, onSwitchMethod, language }: FailedProps) {
  const text = {
    en: {
      title: 'Payment failed or expired',
      message: 'Your payment could not be completed at this time.',
      reasons: 'Common reasons:',
      reason1: 'Quote expired after time limit',
      reason2: 'Insufficient balance in wallet',
      reason3: 'Network connection issue',
      retry: 'Try Again (Refresh Quote)',
      switch: 'Switch Payment Method',
      note: 'If funds were sent, they will be auto-refunded or retried securely.',
      support: 'Need help? Contact support'
    },
    ja: {
      title: 'お支払いを完了できませんでした',
      message: '決済処理中にエラーが発生しました。',
      reasons: '考えられる原因：',
      reason1: '見積もり期限が切れました',
      reason2: 'ウォレットの残高が不足しています',
      reason3: 'ネットワーク接続に問題があります',
      retry: 'もう一��お試しください',
      switch: '別のお支払い方法を選ぶ',
      note: 'お支払いが送信された場合、安全に自動返金または再処理されます。',
      support: 'お困りの際はサポートにご連絡ください'
    },
    zh: {
      title: '支付失败或已过期',
      message: '此时无法完成您的支付。',
      reasons: '常见原因：',
      reason1: '报价超时已过期',
      reason2: '钱包余额不足',
      reason3: '网络连接问题',
      retry: '重试（刷新报价）',
      switch: '切换支付方式',
      note: '如果资金已发送，将自动安全退款或重试。',
      support: '需要帮助？联系客服'
    }
  };

  const t = text[language];

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="mb-8"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-2xl">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl text-slate-900 mb-3">{t.title}</h1>
          <p className="text-slate-500">{t.message}</p>
        </motion.div>

        {/* Reasons Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm mb-8"
        >
          <Card className="bg-white border-slate-200 rounded-2xl p-5">
            <p className="text-sm text-slate-700 mb-3">{t.reasons}</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{t.reason1}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{t.reason2}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{t.reason3}</span>
              </li>
            </ul>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm space-y-3"
        >
          <Button 
            onClick={onRetry}
            className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30 active:scale-95 transition-transform"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {t.retry}
          </Button>
          
          <Button 
            onClick={onSwitchMethod}
            variant="outline"
            className="w-full h-14 rounded-2xl border-slate-200 active:scale-95 transition-transform"
          >
            {t.switch}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom Note */}
      <div className="px-6 pb-8 space-y-4">
        <p className="text-xs text-center text-slate-400 px-4">
          {t.note}
        </p>
        
        <button className="w-full text-sm text-[#00C2A8] py-3 active:scale-95 transition-transform">
          {t.support}
        </button>
      </div>
    </div>
  );
}
