import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Zap, Wallet, Chrome, Smartphone, CreditCard as CreditCardIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SafeCheckoutFooter } from './SafeCheckoutFooter';
import type { Currency, Network, PaymentChannel, YenPaymentMethod } from '../types/order';

export type ExchangeName = 'Binance' | 'OKX' | 'Bybit' | 'Coinbase';

interface PaymentHubProps {
  onBack: () => void;
  onCryptoPayment: (currency: Currency, channel: PaymentChannel, network?: Network, exchange?: ExchangeName) => void;
  onYenPayment: (method: YenPaymentMethod) => void;
  language: 'en' | 'ja' | 'zh';
  totalAmount: number;
}

export function PaymentHub({ onBack, onCryptoPayment, onYenPayment, language, totalAmount }: PaymentHubProps) {
  const [activeTab, setActiveTab] = useState<'crypto' | 'yen'>('crypto');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('Base');
  const [timeLeft, setTimeLeft] = useState(45);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [showMoreExchanges, setShowMoreExchanges] = useState(false);

  // Check Apple Pay availability
  useEffect(() => {
    // Check if Apple Pay is available (Safari only)
    const checkApplePay = () => {
      if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        setIsApplePayAvailable(true);
      }
    };
    checkApplePay();
  }, []);

  // Quote refresh timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeLeft(45);
    }
  }, [timeLeft]);

  const text = {
    en: {
      title: 'Payment Hub',
      cryptoTab: 'Crypto',
      yenTab: '円で支払う (Yen)',
      total: 'Total',
      quote: 'Quote refresh in',
      smartRec: 'Smart Recommendation',
      
      // Crypto section
      chooseCurrency: 'Choose your payment currency',
      usdcTitle: 'USDC',
      usdcDesc: 'Global stablecoin • Multi-chain supported',
      jpycTitle: 'JPYC',
      jpycDesc: 'Japanese stablecoin • Fast & gas efficient',
      binanceTitle: 'Binance Pay (Instant)',
      binanceSubtitle: 'No gas fee • 1-sec confirmation',
      okxTitle: 'OKX Pay',
      okxSubtitle: 'No gas fee • Fast settlement',
      bybitTitle: 'Bybit Pay',
      bybitSubtitle: 'No gas fee • Instant transfer',
      coinbaseTitle: 'Coinbase Pay',
      coinbaseSubtitle: 'No gas fee • Secure & fast',
      moreExchanges: 'More exchange options',
      lessExchanges: 'Show less',
      orOnchain: 'or pay on-chain',
      selectNetwork: 'Select Network',
      estimatedFee: 'Estimated fee',
      selectWallet: 'Select Wallet',
      walletConnectTitle: 'Use your wallet',
      walletConnectSub: 'OKX, Trust, Coinbase…',
      metamaskTitle: 'Connect browser wallet',
      metamaskSub: 'MetaMask extension',
      
      // Yen section
      applePayTitle: 'Apple Pay',
      applePaySub: 'Fastest on iPhone • Face ID',
      applePayUnavailable: 'Apple Pay not available. Try Safari.',
      paypayTitle: 'PayPay',
      paypaySub: 'Open PayPay app to complete',
      rakutenTitle: 'Rakuten Pay',
      rakutenSub: 'Open Rakuten Pay app to complete',
      cardTitle: 'Credit Card',
      cardSub: 'Use your card • Apple Pay preferred'
    },
    ja: {
      title: 'お支払い方法を選択',
      cryptoTab: '暗号資産',
      yenTab: '日本円',
      total: 'お会計金額',
      quote: 'レート更新まで',
      smartRec: '推奨',
      
      // Crypto section
      chooseCurrency: 'お支払いに使用する通貨を選択してください',
      usdcTitle: 'USDC',
      usdcDesc: '米ドル連動ステーブルコイン • 複数チェーン対応',
      jpycTitle: 'JPYC',
      jpycDesc: '日本円連動ステーブルコイン • 高速・低手数料',
      binanceTitle: 'Binance Pay（即時決済）',
      binanceSubtitle: 'ガス代不要 • 即時承認',
      okxTitle: 'OKX Pay',
      okxSubtitle: 'ガス代不要 • 高速決済',
      bybitTitle: 'Bybit Pay',
      bybitSubtitle: 'ガス代不要 • 即時送金',
      coinbaseTitle: 'Coinbase Pay',
      coinbaseSubtitle: 'ガス代不要 • 安全・高速',
      moreExchanges: 'その他の取引所オプション',
      lessExchanges: '閉じる',
      orOnchain: 'または、オンチェーンでお支払い',
      selectNetwork: 'ネットワークを選択してください',
      estimatedFee: '推定ガス代',
      selectWallet: 'ウォレットを選択してください',
      walletConnectTitle: 'ウォレットを接続',
      walletConnectSub: 'OKX・Trust Wallet・Coinbase など',
      metamaskTitle: 'ブラウザウォレットで接続',
      metamaskSub: 'MetaMask ブラウザ拡張機能',
      
      // Yen section
      applePayTitle: 'Apple Pay',
      applePaySub: 'Face ID で素早くお支払い',
      applePayUnavailable: 'Apple Pay はご利用いただけません。Safari をお試しください。',
      paypayTitle: 'PayPay',
      paypaySub: 'PayPay アプリでお支払い',
      rakutenTitle: '楽天ペイ',
      rakutenSub: '楽天ペイ アプリでお支払い',
      cardTitle: 'クレジットカード',
      cardSub: 'Visa・Mastercard・JCB など'
    },
    zh: {
      title: '支付中心',
      cryptoTab: 'Crypto',
      yenTab: '日元支付',
      total: '总计',
      quote: '报价刷新倒计时',
      smartRec: '智能推荐',
      
      // Crypto section
      chooseCurrency: '选择支付货币',
      usdcTitle: 'USDC',
      usdcDesc: '全球稳定币 • 多链支持',
      jpycTitle: 'JPYC',
      jpycDesc: '日元稳定币 • 快速低费',
      binanceTitle: 'Binance Pay（即时）',
      binanceSubtitle: '无燃气费 • 1秒确认',
      okxTitle: 'OKX Pay',
      okxSubtitle: '无燃气费 • 快速结算',
      bybitTitle: 'Bybit Pay',
      bybitSubtitle: '无燃气费 • 即时转账',
      coinbaseTitle: 'Coinbase Pay',
      coinbaseSubtitle: '无燃气费 • 安全快速',
      moreExchanges: '更多交易所选项',
      lessExchanges: '收起',
      orOnchain: '或链上支付',
      selectNetwork: '选择网络',
      estimatedFee: '预估费用',
      selectWallet: '选择钱包',
      walletConnectTitle: '使用钱包',
      walletConnectSub: 'OKX、Trust、Coinbase…',
      metamaskTitle: '连接浏览器钱包',
      metamaskSub: 'MetaMask扩展',
      
      // Yen section
      applePayTitle: 'Apple Pay',
      applePaySub: 'iPhone最快 • Face ID',
      applePayUnavailable: 'Apple Pay不可用。请尝试Safari。',
      paypayTitle: 'PayPay',
      paypaySub: '打开PayPay应用完成',
      rakutenTitle: '乐天支付',
      rakutenSub: '打开乐天支付应用完成',
      cardTitle: '信用卡',
      cardSub: '使用您的卡 • 推荐Apple Pay'
    }
  };

  const t = text[language];

  const usdcAmount = (totalAmount / 151).toFixed(2);
  const jpycAmount = totalAmount;

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

  const networks = selectedCurrency === 'USDC' ? usdcNetworks : jpycNetworks;
  const selectedNetworkFee = networks.find(n => n.value === selectedNetwork)?.fee || '~$0.02';

  // Auto-select recommended network when currency changes
  useEffect(() => {
    if (selectedCurrency === 'USDC') {
      setSelectedNetwork('Base');
    } else if (selectedCurrency === 'JPYC') {
      setSelectedNetwork('Polygon');
    }
  }, [selectedCurrency]);

  // Smart recommendation based on device
  const smartRecommendation = isApplePayAvailable ? 'applepay' : 'binance';

  // Default to yen tab
  useEffect(() => {
    setActiveTab('yen');
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-10 pb-3 bg-white shadow-sm">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl text-slate-900 mb-3">{t.title}</h1>

        {/* Total & Quote Timer */}
        <Card className="bg-gradient-to-br from-[#00C2A8]/10 to-[#00C2A8]/5 border-[#00C2A8]/20 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">{t.total}</span>
            {activeTab === 'crypto' && (
              <motion.div 
                className="flex items-center gap-2"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                <span className="text-xs text-slate-600">{t.quote}</span>
                <span className="text-xs text-slate-900 tabular-nums">
                  00:{String(timeLeft).padStart(2, '0')}
                </span>
              </motion.div>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl text-slate-900">¥{totalAmount.toLocaleString()}</span>
            {activeTab === 'crypto' && (
              <span className="text-lg text-slate-400">≈ {usdcAmount} USDC</span>
            )}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'crypto' | 'yen')} className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-4 pb-3 bg-white">
          <TabsList className="w-full grid grid-cols-2 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="yen" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {t.yenTab}
            </TabsTrigger>
            <TabsTrigger value="crypto" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {t.cryptoTab}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Crypto Tab Content */}
        <TabsContent value="crypto" className="flex-1 overflow-y-auto px-6 py-3 pb-8 min-h-0">
          {/* Currency Selection */}
          {!selectedCurrency && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg text-slate-900 mb-3">{t.chooseCurrency}</h3>
              <div className="space-y-2.5">
                <Card
                  onClick={() => setSelectedCurrency('USDC')}
                  className="border rounded-2xl p-4 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8] hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💵</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">{t.usdcTitle}</p>
                      <p className="text-sm text-slate-500">{t.usdcDesc}</p>
                      <p className="text-[#00C2A8] mt-1">{usdcAmount} USDC</p>
                    </div>
                  </div>
                </Card>

                <Card
                  onClick={() => setSelectedCurrency('JPYC')}
                  className="border rounded-2xl p-4 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8] hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💴</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">{t.jpycTitle}</p>
                      <p className="text-sm text-slate-500">{t.jpycDesc}</p>
                      <p className="text-[#00C2A8] mt-1">¥{jpycAmount.toLocaleString()} JPYC</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* After Currency Selected */}
          {selectedCurrency && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 mt-4"
            >
              {/* Selected Currency Header */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-lg">{selectedCurrency === 'USDC' ? '💵' : '💴'}</span>
                  </div>
                  <div>
                    <p className="text-slate-900">{selectedCurrency}</p>
                    <p className="text-xs text-slate-500">
                      {selectedCurrency === 'USDC' ? `${usdcAmount} USDC` : `¥${jpycAmount.toLocaleString()} JPYC`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCurrency(null)}
                  className="text-xs text-[#00C2A8] active:scale-95 transition-transform"
                >
                  Change
                </button>
              </div>

              {/* Exchange Pay Options (USDC only) */}
              {selectedCurrency === 'USDC' && (
                <>
                  <div className="space-y-2">
                    {/* Binance Pay - Recommended */}
                    <div>
                      <Badge className="bg-[#FFD34E] text-slate-900 mb-2">
                        <Zap className="w-3 h-3 mr-1" />
                        {t.smartRec}
                      </Badge>
                      <Card
                        onClick={() => onCryptoPayment('USDC', 'binance', undefined, 'Binance')}
                        className="border-2 border-[#FFD34E] rounded-2xl p-3.5 cursor-pointer active:scale-95 transition-all bg-gradient-to-br from-[#FFD34E]/10 to-[#FFD34E]/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#FFD34E] flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-slate-900" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-900">{t.binanceTitle}</p>
                            <p className="text-sm text-slate-500">{t.binanceSubtitle}</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* More Exchanges Toggle */}
                    <button
                      onClick={() => setShowMoreExchanges(!showMoreExchanges)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
                    >
                      <span>{showMoreExchanges ? t.lessExchanges : t.moreExchanges}</span>
                      {showMoreExchanges ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Collapsible Exchange Options */}
                    <AnimatePresence>
                      {showMoreExchanges && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {/* OKX Pay */}
                          <Card
                            onClick={() => onCryptoPayment('USDC', 'binance', undefined, 'OKX')}
                            className="border rounded-2xl p-3 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">⭕</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-900">{t.okxTitle}</p>
                                <p className="text-xs text-slate-500">{t.okxSubtitle}</p>
                              </div>
                            </div>
                          </Card>

                          {/* Bybit Pay */}
                          <Card
                            onClick={() => onCryptoPayment('USDC', 'binance', undefined, 'Bybit')}
                            className="border rounded-2xl p-3 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">🟡</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-900">{t.bybitTitle}</p>
                                <p className="text-xs text-slate-500">{t.bybitSubtitle}</p>
                              </div>
                            </div>
                          </Card>

                          {/* Coinbase Pay */}
                          <Card
                            onClick={() => onCryptoPayment('USDC', 'binance', undefined, 'Coinbase')}
                            className="border rounded-2xl p-3 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">🔵</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-900">{t.coinbaseTitle}</p>
                                <p className="text-xs text-slate-500">{t.coinbaseSubtitle}</p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-3 my-2.5">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-sm text-slate-400">{t.orOnchain}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                </>
              )}

              {/* JPYC - Network Selection + Wallet Options */}
              {selectedCurrency === 'JPYC' ? (
                <>
                  {/* Network Selection for JPYC */}
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">{t.selectNetwork}</label>
                    <Select value={selectedNetwork} onValueChange={(v) => setSelectedNetwork(v as Network)}>
                      <SelectTrigger className="w-full h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jpycNetworks.map((network) => (
                          <SelectItem key={network.value} value={network.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{network.label}</span>
                              <span className="text-xs text-slate-400 ml-4">{network.fee}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400 mt-2">{t.estimatedFee}: {selectedNetworkFee}</p>
                  </div>

                  {/* Wallet Connection Options for JPYC */}
                  <div className="space-y-2.5">
                    <Card
                      onClick={() => onCryptoPayment('JPYC', 'walletconnect', selectedNetwork)}
                      className="border rounded-2xl p-3.5 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900">WalletConnect</p>
                        </div>
                      </div>
                    </Card>

                    <Card
                      onClick={() => onCryptoPayment('JPYC', 'metamask', selectedNetwork)}
                      className="border rounded-2xl p-3.5 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <Chrome className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900">MetaMask</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              ) : (
                /* USDC - Network Selection + Wallet Options */
                <>
                  {/* Network Selection */}
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">{t.selectNetwork}</label>
                    <Select value={selectedNetwork} onValueChange={(v) => setSelectedNetwork(v as Network)}>
                      <SelectTrigger className="w-full h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {networks.map((network) => (
                          <SelectItem key={network.value} value={network.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{network.label}</span>
                              <span className="text-xs text-slate-400 ml-4">{network.fee}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400 mt-2">{t.estimatedFee}: {selectedNetworkFee}</p>
                  </div>

                  {/* Wallet Connection Options */}
                  <div className="space-y-2.5">
                    <Card
                      onClick={() => onCryptoPayment(selectedCurrency, 'walletconnect', selectedNetwork)}
                      className="border rounded-2xl p-3.5 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900">WalletConnect</p>
                        </div>
                      </div>
                    </Card>

                    <Card
                      onClick={() => onCryptoPayment(selectedCurrency, 'metamask', selectedNetwork)}
                      className="border rounded-2xl p-3.5 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <Chrome className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900">MetaMask</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </TabsContent>

        {/* Yen Tab Content */}
        <TabsContent value="yen" className="flex-1 overflow-y-auto px-6 py-3 pb-8 space-y-4 min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Smart Recommendation - Apple Pay (if available) */}
            {isApplePayAvailable && (
              <div>
                <Badge className="bg-[#00C2A8] text-white mb-3">
                  <Zap className="w-3 h-3 mr-1" />
                  {t.smartRec}
                </Badge>
                <Card
                  onClick={() => onYenPayment('applepay')}
                  className="border-2 border-[#00C2A8] rounded-2xl p-4 cursor-pointer active:scale-95 transition-all bg-gradient-to-br from-[#00C2A8]/10 to-[#00C2A8]/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">{t.applePayTitle}</p>
                      <p className="text-sm text-slate-500">{t.applePaySub}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Other Yen Payment Methods */}
            <div className="space-y-3">
              {/* PayPay */}
              <Card
                onClick={() => onYenPayment('paypay')}
                className="border rounded-2xl p-4 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF0000] flex items-center justify-center">
                    <span className="text-white text-xs">PP</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900">{t.paypayTitle}</p>
                    <p className="text-sm text-slate-500">{t.paypaySub}</p>
                  </div>
                </div>
              </Card>

              {/* Rakuten Pay */}
              <Card
                onClick={() => onYenPayment('rakutenpay')}
                className="border rounded-2xl p-4 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BF0000] flex items-center justify-center">
                    <span className="text-white text-xs">楽</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900">{t.rakutenTitle}</p>
                    <p className="text-sm text-slate-500">{t.rakutenSub}</p>
                  </div>
                </div>
              </Card>

              {/* Credit Card */}
              <Card
                onClick={() => onYenPayment('card')}
                className="border rounded-2xl p-4 cursor-pointer active:scale-95 transition-all hover:border-[#00C2A8]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <CreditCardIcon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900">{t.cardTitle}</p>
                    <p className="text-sm text-slate-500">{t.cardSub}</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="px-6 py-4 bg-white border-t border-slate-100">
        <SafeCheckoutFooter language={language} />
      </div>
    </div>
  );
}
