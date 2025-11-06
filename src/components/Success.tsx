import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Copy, ExternalLink, FileText, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import type { Currency, PaymentChannel, YenPaymentMethod, CartItem } from '../types/order';

interface SuccessProps {
  language: 'en' | 'ja' | 'zh';
  onNewPayment: () => void;
  currency?: Currency;
  paymentChannel?: PaymentChannel;
  yenMethod?: YenPaymentMethod;
  totalAmount: number;
  cartItems?: CartItem[];
}

export function Success({ language, onNewPayment, currency, paymentChannel, yenMethod, totalAmount, cartItems = [] }: SuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mock transaction data
  const fromAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const toAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const txId = '0xf8d6e45b2c1a3f9e7d8c5b4a3e2f1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2';

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCryptoPayment = !!currency;
  const cryptoAmount = currency === 'USDC' 
    ? (totalAmount / 151).toFixed(2) 
    : totalAmount.toLocaleString();

  const channelNames: Record<PaymentChannel, string> = {
    binance: 'Binance Pay',
    walletconnect: 'WalletConnect',
    metamask: 'MetaMask',
    onchain: 'On-chain'
  };

  const yenMethodNames: Record<YenPaymentMethod, string> = {
    applepay: 'Apple Pay',
    paypay: 'PayPay',
    rakutenpay: 'Rakuten Pay',
    card: 'Credit Card'
  };

  const paymentMethodName = isCryptoPayment 
    ? (paymentChannel ? channelNames[paymentChannel] : 'Crypto')
    : (yenMethod ? yenMethodNames[yenMethod] : 'Yen');

  const paidText = isCryptoPayment
    ? (currency === 'USDC' ? `${cryptoAmount} USDC` : `¥${cryptoAmount} JPYC`)
    : `¥${totalAmount.toLocaleString()}`;

  const text = {
    en: {
      title: 'Payment Successful',
      subtitle: 'Order #20251102-AB123',
      paid: `Paid ${paidText} via ${paymentMethodName}`,
      from: 'From',
      to: 'To',
      txid: 'Transaction ID',
      viewOnExplorer: 'View on Explorer',
      complete: 'Complete',
      copied: 'Copied!',
      orderDetails: 'Order Details',
      receipt: 'View Receipt',
      storeName: 'Café Max',
      storeLocation: 'Shibuya, Tokyo',
      paymentTime: 'Payment Time',
      paymentMethod: 'Payment Method',
      subtotal: 'Subtotal',
      tax: 'Tax (10%)',
      total: 'Total',
      qty: 'Qty'
    },
    ja: {
      title: 'お支払いが完了しました',
      subtitle: 'ご注文番号：#20251102-AB123',
      paid: `${paymentMethodName}で ${paidText} をお支払いいただきました`,
      from: '送信元アドレス',
      to: '送信先アドレス',
      txid: 'トランザクションID',
      viewOnExplorer: 'ブロックチェーンで確認',
      complete: '完了',
      copied: 'コピーしました',
      orderDetails: 'ご注文内容',
      receipt: 'レシートを表示',
      storeName: 'カフェMax',
      storeLocation: '東京都渋谷区',
      paymentTime: 'お支払い日時',
      paymentMethod: 'お支払い方法',
      subtotal: '小計',
      tax: '消費税（10%）',
      total: 'お会計',
      qty: '数量'
    },
    zh: {
      title: '支付成功',
      subtitle: '订单号 #20251102-AB123',
      paid: `通过${paymentMethodName}支付了${paidText}`,
      from: '发送方',
      to: '接收方',
      txid: '交易ID',
      viewOnExplorer: '在浏览器查看',
      complete: '完成',
      copied: '已复制！',
      orderDetails: '订单详情',
      receipt: '查看收据',
      storeName: 'Café Max',
      storeLocation: '东京涩谷',
      paymentTime: '支付时间',
      paymentMethod: '支付方式',
      subtotal: '小计',
      tax: '税费 (10%)',
      total: '总计',
      qty: '数量'
    }
  };

  const t = text[language];

  // Calculate subtotal and tax
  const subtotal = Math.round(totalAmount / 1.1);
  const tax = totalAmount - subtotal;
  const currentTime = new Date().toLocaleString(language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB] relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#00C2A8', '#FFD34E', '#00A890', '#FFC107'][i % 4]
              }}
              initial={{ 
                y: -20, 
                opacity: 1,
                rotate: 0
              }}
              animate={{ 
                y: 900,
                opacity: 0,
                rotate: 360
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Success Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="mb-6 flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#00A890] flex items-center justify-center shadow-2xl">
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <motion.path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl text-slate-900 mb-2">{t.title}</h1>
          <p className="text-slate-500 mb-1">{t.subtitle}</p>
          <p className="text-sm text-slate-400">{t.paid}</p>
        </motion.div>

        {/* Conditional Details - Crypto or Yen */}
        {isCryptoPayment ? (
          /* Crypto Transaction Details */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full space-y-3 mb-6"
          >
            {/* From Address */}
            <Card className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">{t.from}</p>
                  <p className="text-sm text-slate-900 font-mono">{truncateAddress(fromAddress)}</p>
                </div>
                <button
                  onClick={() => handleCopy(fromAddress, 'from')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              {copiedField === 'from' && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[#00C2A8] mt-1"
                >
                  {t.copied}
                </motion.p>
              )}
            </Card>

            {/* To Address */}
            <Card className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">{t.to}</p>
                  <p className="text-sm text-slate-900 font-mono">{truncateAddress(toAddress)}</p>
                </div>
                <button
                  onClick={() => handleCopy(toAddress, 'to')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              {copiedField === 'to' && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[#00C2A8] mt-1"
                >
                  {t.copied}
                </motion.p>
              )}
            </Card>

            {/* Transaction ID */}
            <Card className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">{t.txid}</p>
                  <p className="text-sm text-slate-900 font-mono break-all">{truncateAddress(txId)}</p>
                </div>
                <button
                  onClick={() => handleCopy(txId, 'txid')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              {copiedField === 'txid' && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[#00C2A8] mb-2"
                >
                  {t.copied}
                </motion.p>
              )}
              <button className="w-full flex items-center justify-center gap-2 text-xs text-[#00C2A8] hover:text-[#00A890] transition-colors py-2">
                <ExternalLink className="w-3 h-3" />
                {t.viewOnExplorer}
              </button>
            </Card>
          </motion.div>
        ) : (
          /* Yen Payment Receipt Details */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full space-y-4 mb-6"
          >
            {/* Store & Payment Info */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#00C2A8] mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-900">{t.storeName}</p>
                    <p className="text-xs text-slate-500">{t.storeLocation}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#00C2A8] mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">{t.paymentTime}</p>
                    <p className="text-sm text-slate-900">{currentTime}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#00C2A8] mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">{t.paymentMethod}</p>
                    <p className="text-sm text-slate-900">{paymentMethodName}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            {cartItems.length > 0 && (
              <Card className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm text-slate-900 mb-4">{t.orderDetails}</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">
                          {language === 'ja' ? item.nameJa : item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {t.qty}: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm text-slate-900">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  
                  <Separator className="my-3" />
                  
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t.subtotal}</span>
                    <span className="text-slate-900">¥{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {/* Tax */}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t.tax}</span>
                    <span className="text-slate-900">¥{tax.toLocaleString()}</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  {/* Total */}
                  <div className="flex justify-between">
                    <span className="text-slate-900">{t.total}</span>
                    <span className="text-xl text-slate-900">¥{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* View Receipt Button */}
            <Button 
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8]/5 active:scale-95 transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t.receipt}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Complete Button */}
      <div className="px-6 pb-8">
        <Button 
          onClick={onNewPayment}
          className="w-full h-14 rounded-xl bg-[#00C2A8] text-white hover:bg-[#00A890] active:scale-95 transition-transform shadow-lg"
        >
          {t.complete}
        </Button>
      </div>
    </div>
  );
}
