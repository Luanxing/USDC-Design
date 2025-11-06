import { motion } from 'motion/react';
import { ArrowLeft, Zap, Wallet, Chrome, Link as LinkIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SafeCheckoutFooter } from './SafeCheckoutFooter';

interface PaymentMethodsProps {
  onSelectMethod: (method: string) => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
}

export function PaymentMethods({ onSelectMethod, onBack, language }: PaymentMethodsProps) {
  const text = {
    en: {
      title: 'Select how you\'d like to pay',
      recommended: 'Smart Recommendation',
      binanceTitle: 'Binance Pay (Instant)',
      binanceSubtitle: 'No gas fee • Off-chain • 1-sec confirmation',
      or: 'or choose another method',
      walletConnect: 'Use your wallet',
      walletConnectSub: 'OKX, Trust, Coinbase…',
      metamask: 'Connect browser wallet',
      metamaskSub: 'MetaMask extension',
      onchain: 'Pay with USDC transfer',
      onchainSub: 'Base / Arbitrum',
      secured: 'All payments secured by Smartiful Aggregator'
    },
    ja: {
      title: 'お支払い方法を選択',
      recommended: 'おすすめ',
      binanceTitle: 'Binance Pay（即時）',
      binanceSubtitle: 'ガス代なし • オフチェーン • 1秒確認',
      or: 'または他の方法を選択',
      walletConnect: 'ウォレットを使用',
      walletConnectSub: 'OKX、Trust、Coinbase…',
      metamask: 'ブラウザウォレット接続',
      metamaskSub: 'MetaMask拡張機能',
      onchain: 'USDC転送で支払い',
      onchainSub: 'Base / Arbitrum',
      secured: 'すべての支払いはSmartiful Aggregatorで保護されています'
    },
    zh: {
      title: '选择支付方式',
      recommended: '智能推荐',
      binanceTitle: 'Binance Pay（即时）',
      binanceSubtitle: '无燃气费 • 链下 • 1秒确认',
      or: '或选择其他方式',
      walletConnect: '使用钱包',
      walletConnectSub: 'OKX、Trust、Coinbase…',
      metamask: '连接浏览器钱包',
      metamaskSub: 'MetaMask扩展',
      onchain: '使用USDC转账支付',
      onchainSub: 'Base / Arbitrum',
      secured: '所有支付均由Smartiful Aggregator保护'
    }
  };

  const t = text[language];

  const methods = [
    {
      id: 'walletconnect',
      icon: <Wallet className="w-6 h-6" />,
      title: t.walletConnect,
      subtitle: t.walletConnectSub,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'metamask',
      icon: <Chrome className="w-6 h-6" />,
      title: t.metamask,
      subtitle: t.metamaskSub,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'onchain',
      icon: <LinkIcon className="w-6 h-6" />,
      title: t.onchain,
      subtitle: t.onchainSub,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl text-slate-900">{t.title}</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 overflow-y-auto pb-6">
        {/* Recommended Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge className="mb-3 bg-gradient-to-r from-[#FFD34E] to-[#FFC107] text-slate-900 border-0">
            <Zap className="w-3 h-3 mr-1" />
            {t.recommended}
          </Badge>
          
          <Card 
            onClick={() => onSelectMethod('binance')}
            className="bg-gradient-to-br from-[#FFD34E] to-[#FFC107] border-0 shadow-xl rounded-2xl p-6 cursor-pointer active:scale-95 transition-transform mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center flex-shrink-0 shadow-md">
                <div className="w-8 h-8 rounded-full bg-[#FFD34E]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-slate-900">{t.binanceTitle}</h3>
                  <Zap className="w-4 h-4 text-slate-900" />
                </div>
                <p className="text-sm text-slate-700">{t.binanceSubtitle}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-400">{t.or}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Other Methods */}
        <div className="space-y-3">
          {methods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            >
              <Card
                onClick={() => onSelectMethod(method.id)}
                className="bg-white border-slate-200 rounded-2xl p-5 cursor-pointer hover:shadow-md active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 mb-1">{method.title}</h3>
                    <p className="text-sm text-slate-500">{method.subtitle}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-xs text-center text-slate-400 mt-6 mb-4">
          {t.secured}
        </p>

        <SafeCheckoutFooter language={language} />
      </div>
    </div>
  );
}
