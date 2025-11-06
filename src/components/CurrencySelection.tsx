import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Currency } from '../types/order';

interface CurrencySelectionProps {
  onBack: () => void;
  onContinue: (currency: Currency) => void;
  language: 'en' | 'ja' | 'zh';
  totalAmount: number;
}

export function CurrencySelection({ onBack, onContinue, language, totalAmount }: CurrencySelectionProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

  const text = {
    en: {
      title: 'Choose your payment currency',
      usdcTitle: 'USDC',
      usdcDesc: 'Global stablecoin • Multi-chain supported',
      usdcNetworks: 'Available on Base, Arbitrum, Solana, Ethereum',
      jpycTitle: 'JPYC',
      jpycDesc: 'Japanese stablecoin • Fast & gas efficient',
      jpycNetworks: 'Available on Ethereum, Polygon, Avalanche',
      continue: 'Continue',
      balanceNote: 'Your wallet balance will be checked'
    },
    ja: {
      title: '支払い通貨を選択',
      usdcTitle: 'USDC',
      usdcDesc: 'グローバルステーブルコイン • マルチチェーン対応',
      usdcNetworks: 'Base、Arbitrum、Solana、Ethereumで利用可能',
      jpycTitle: 'JPYC',
      jpycDesc: '日本円連動ステーブルコイン • 高速＆低手数料',
      jpycNetworks: 'Ethereum、Polygon、Avalancheで利用可能',
      continue: '続ける',
      balanceNote: 'ウォレット残高を確認します'
    },
    zh: {
      title: '选择支付货币',
      usdcTitle: 'USDC',
      usdcDesc: '全球稳定币 • 多链支持',
      usdcNetworks: '支持 Base、Arbitrum、Solana、Ethereum',
      jpycTitle: 'JPYC',
      jpycDesc: '日元稳定币 • 快速低费',
      jpycNetworks: '支持 Ethereum、Polygon、Avalanche',
      continue: '继续',
      balanceNote: '将检查您的钱包余额'
    }
  };

  const t = text[language];

  const usdcAmount = (totalAmount / 151).toFixed(2);
  const jpycAmount = totalAmount;

  const currencies = [
    {
      type: 'USDC' as Currency,
      icon: '💵',
      title: t.usdcTitle,
      description: t.usdcDesc,
      networks: t.usdcNetworks,
      amount: `${usdcAmount} USDC`,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      type: 'JPYC' as Currency,
      icon: '💴',
      title: t.jpycTitle,
      description: t.jpycDesc,
      networks: t.jpycNetworks,
      amount: `¥${jpycAmount.toLocaleString()} JPYC`,
      gradient: 'from-green-500 to-green-600'
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

      {/* Currency Options */}
      <div className="flex-1 px-6 overflow-y-auto pb-6">
        <div className="space-y-4">
          {currencies.map((currency, index) => (
            <motion.div
              key={currency.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card
                onClick={() => setSelectedCurrency(currency.type)}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedCurrency === currency.type
                    ? 'border-[#00C2A8] bg-[#00C2A8]/5 shadow-lg shadow-[#00C2A8]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currency.gradient} flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                    {currency.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl text-slate-900">{currency.title}</h3>
                      {selectedCurrency === currency.type && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-[#00C2A8] flex items-center justify-center ml-auto"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{currency.description}</p>
                    
                    <div className="bg-slate-100 rounded-lg px-3 py-2 mb-3">
                      <p className="text-xs text-slate-500 mb-1">Payment amount</p>
                      <p className="text-slate-900">{currency.amount}</p>
                    </div>
                    
                    {selectedCurrency === currency.type && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-3 border-t border-slate-200"
                      >
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-[#00C2A8] mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-slate-500">{currency.networks}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-center text-slate-400 mt-6">{t.balanceNote}</p>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8">
        <Button
          onClick={() => selectedCurrency && onContinue(selectedCurrency)}
          disabled={!selectedCurrency}
          className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          {t.continue}
        </Button>
      </div>
    </div>
  );
}
