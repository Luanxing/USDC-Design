import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Zap, Wallet, Chrome, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SafeCheckoutFooter } from './SafeCheckoutFooter';
import type { Currency, Network, PaymentChannel } from '../types/order';

interface NetworkAndPaymentProps {
  currency: Currency;
  onBack: () => void;
  onSelectPayment: (channel: PaymentChannel, network?: Network) => void;
  language: 'en' | 'ja' | 'zh';
}

export function NetworkAndPayment({ currency, onBack, onSelectPayment, language }: NetworkAndPaymentProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(
    currency === 'USDC' ? 'Base' : 'Polygon'
  );

  const text = {
    en: {
      title: currency === 'USDC' ? 'Select how to pay' : 'Select network and wallet',
      recommended: 'Smart Recommendation',
      binanceTitle: 'Binance Pay (Instant)',
      binanceSubtitle: 'No gas fee • 1-sec confirmation',
      or: 'or pay on-chain',
      selectNetwork: 'Select Network',
      estimatedFee: 'Estimated fee',
      // USDC payment methods
      walletConnectUsdc: 'Use your wallet',
      walletConnectUsdcSub: 'OKX, Trust, Coinbase…',
      metamaskUsdc: 'Connect browser wallet',
      metamaskUsdcSub: 'MetaMask extension',
      // JPYC payment methods
      walletConnectJpyc: 'WalletConnect',
      walletConnectJpycSub: 'OKX, Trust, Coinbase…',
      metamaskJpyc: 'MetaMask',
      metamaskJpycSub: 'MetaMask extension',
      onchain: 'Direct on-chain transfer',
      onchainSub: 'Manual wallet transfer',
      recommendedNote: 'Recommended: Polygon (Low fee & fast confirmation)',
      proceed: 'Proceed to Payment',
      secured: 'All payments secured by Smartiful Aggregator'
    },
    ja: {
      title: currency === 'USDC' ? '支払い方法を選択' : 'ネットワークとウォレットを選択',
      recommended: 'おすすめ',
      binanceTitle: 'Binance Pay（即時）',
      binanceSubtitle: 'ガス代なし • 1秒確認',
      or: 'またはオンチェーンで支払い',
      selectNetwork: 'ネットワークを選択',
      estimatedFee: '推定手数料',
      // USDC payment methods
      walletConnectUsdc: 'ウォレットを使用',
      walletConnectUsdcSub: 'OKX、Trust、Coinbase…',
      metamaskUsdc: 'ブラウザウォレット接続',
      metamaskUsdcSub: 'MetaMask拡張機能',
      // JPYC payment methods
      walletConnectJpyc: 'WalletConnect',
      walletConnectJpycSub: 'OKX、Trust、Coinbase…',
      metamaskJpyc: 'MetaMask',
      metamaskJpycSub: 'MetaMask拡張機能',
      onchain: 'オンチェーン直接転送',
      onchainSub: '手動ウォレット転送',
      recommendedNote: 'おすすめ：Polygon（低手数料＆高速確認）',
      proceed: '支払いに進む',
      secured: 'すべての支払いはSmartiful Aggregatorで保護されています'
    },
    zh: {
      title: currency === 'USDC' ? '选择支付方式' : '选择网络和钱包',
      recommended: '智能推荐',
      binanceTitle: 'Binance Pay（即时）',
      binanceSubtitle: '无燃气费 • 1秒确认',
      or: '或链上支付',
      selectNetwork: '选择网络',
      estimatedFee: '预估费用',
      // USDC payment methods
      walletConnectUsdc: '使用钱包',
      walletConnectUsdcSub: 'OKX、Trust、Coinbase…',
      metamaskUsdc: '连接浏览器钱包',
      metamaskUsdcSub: 'MetaMask扩展',
      // JPYC payment methods
      walletConnectJpyc: 'WalletConnect',
      walletConnectJpycSub: 'OKX、Trust、Coinbase…',
      metamaskJpyc: 'MetaMask',
      metamaskJpycSub: 'MetaMask扩展',
      onchain: '直接链上转账',
      onchainSub: '手动钱包转账',
      recommendedNote: '推荐：Polygon（低费用快速确认）',
      proceed: '前往支付',
      secured: '所有支付均由Smartiful Aggregator保护'
    }
  };

  const t = text[language];

  // Network configurations
  const usdcNetworks = [
    { value: 'Base' as Network, label: 'Base', fee: '~$0.02' },
    { value: 'Arbitrum' as Network, label: 'Arbitrum', fee: '~$0.05' },
    { value: 'Solana' as Network, label: 'Solana', fee: '~$0.001' },
    { value: 'Ethereum' as Network, label: 'Ethereum', fee: '~$0.60' }
  ];

  const jpycNetworks = [
    { value: 'Polygon' as Network, label: 'Polygon', fee: '~$0.01' },
    { value: 'Ethereum' as Network, label: 'Ethereum', fee: '~$0.60' },
    { value: 'Avalanche' as Network, label: 'Avalanche', fee: '~$0.03' }
  ];

  const networks = currency === 'USDC' ? usdcNetworks : jpycNetworks;
  const selectedNetworkFee = networks.find(n => n.value === selectedNetwork)?.fee || '~$0.02';

  // Different payment methods based on currency
  const paymentMethods = currency === 'USDC' 
    ? [
        {
          id: 'walletconnect' as PaymentChannel,
          icon: <Wallet className="w-6 h-6" />,
          title: t.walletConnectUsdc,
          subtitle: t.walletConnectUsdcSub,
          color: 'from-blue-500 to-blue-600'
        }
      ]
    : [
        {
          id: 'walletconnect' as PaymentChannel,
          icon: <Wallet className="w-6 h-6" />,
          title: t.walletConnectJpyc,
          subtitle: t.walletConnectJpycSub,
          color: 'from-blue-500 to-blue-600'
        },
        {
          id: 'metamask' as PaymentChannel,
          icon: <Chrome className="w-6 h-6" />,
          title: t.metamaskJpyc,
          subtitle: t.metamaskJpycSub,
          color: 'from-orange-500 to-orange-600'
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
        {/* Binance Pay - Only for USDC */}
        {currency === 'USDC' && (
          <>
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
                onClick={() => onSelectPayment('binance')}
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
          </>
        )}

        {/* Network Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: currency === 'USDC' ? 0.2 : 0 }}
          className="mb-6"
        >
          <label className="text-sm text-slate-600 mb-2 block">{t.selectNetwork}</label>
          <Select value={selectedNetwork} onValueChange={(v) => setSelectedNetwork(v as Network)}>
            <SelectTrigger className="w-full h-14 rounded-xl bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {networks.map(network => (
                <SelectItem key={network.value} value={network.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{network.label}</span>
                    <span className="text-xs text-slate-400 ml-4">{network.fee}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">{t.estimatedFee}</span>
            <span className="text-slate-900">{selectedNetworkFee}</span>
          </div>

          {currency === 'JPYC' && selectedNetwork === 'Polygon' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3"
            >
              <p className="text-sm text-green-700">{t.recommendedNote}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) + (currency === 'USDC' ? 0.2 : 0) }}
            >
              <Card
                onClick={() => onSelectPayment(method.id, selectedNetwork)}
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
        <p className="text-xs text-center text-slate-400 mb-4">
          {t.secured}
        </p>

        <SafeCheckoutFooter language={language} />
      </div>
    </div>
  );
}
