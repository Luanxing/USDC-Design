import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Currency, Network } from '../types/order';

interface WalletConnectProps {
  onConfirm: () => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
  currency: Currency;
  network: Network;
  totalAmount: number;
}

export function WalletConnect({ onConfirm, onBack, language, currency, network, totalAmount }: WalletConnectProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showTransaction, setShowTransaction] = useState(false);

  const text = {
    en: {
      connect: 'Connect your wallet',
      subtitle: 'Scan or choose below to continue',
      transactionTitle: 'Review Transaction',
      to: 'To',
      merchant: `Merchant Wallet (${network} network)`,
      amount: 'Amount',
      networkFee: 'Network fee',
      paymentId: 'Payment ID',
      confirm: 'Approve & Pay',
      footer: 'Your wallet will ask for confirmation.',
      lowFee: 'Low Fee / Instant Settlement'
    },
    ja: {
      connect: 'ウォレットを接続してください',
      subtitle: 'QRコードをスキャンまたは選択してください',
      transactionTitle: '取引内容の確認',
      to: '送信先',
      merchant: `加盟店ウォレット（${network} ネットワーク）`,
      amount: 'お支払い金額',
      networkFee: 'ガス代',
      paymentId: '決済ID',
      confirm: '承認してお支払いする',
      footer: 'ウォレットアプリで承認操作を行ってください。',
      lowFee: '低手数料・即時決済'
    },
    zh: {
      connect: '连接您的钱包',
      subtitle: '扫描或选择以下方式继续',
      transactionTitle: '审核交易',
      to: '收款方',
      merchant: `商家钱包（${network}网络）`,
      amount: '金额',
      networkFee: '网络费用',
      paymentId: '支付ID',
      confirm: '批准并支付',
      footer: '您的钱包会要求确认。',
      lowFee: '低费用 / 即时结算'
    }
  };

  const t = text[language];

  const cryptoAmount = currency === 'USDC' 
    ? (totalAmount / 151).toFixed(2) 
    : totalAmount.toLocaleString();

  const networkFees: Record<Network, string> = {
    'Base': '~$0.02',
    'Arbitrum': '~$0.05',
    'Solana': '~$0.001',
    'Ethereum': '~$0.60',
    'Polygon': '~$0.01',
    'Avalanche': '~$0.03'
  };

  const gasFee = networkFees[network] || '~$0.02';

  const wallets = [
    { id: 'okx', name: 'OKX Wallet', color: 'from-slate-900 to-slate-800' },
    { id: 'trust', name: 'Trust Wallet', color: 'from-blue-500 to-blue-600' },
    { id: 'coinbase', name: 'Coinbase Wallet', color: 'from-blue-600 to-blue-700' },
    { id: 'rainbow', name: 'Rainbow', color: 'from-purple-500 to-pink-500' },
    { id: 'metamask', name: 'MetaMask', color: 'from-orange-500 to-orange-600' }
  ];

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    setTimeout(() => setShowTransaction(true), 800);
  };

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
      <div className="flex-1 px-6 overflow-y-auto pb-6">
        {!showTransaction ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-2xl text-slate-900 mb-2">{t.connect}</h1>
            <p className="text-slate-500 mb-6">{t.subtitle}</p>

            <div className="space-y-3">
              {wallets.map((wallet, index) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => handleWalletSelect(wallet.id)}
                    className={`bg-white border-slate-200 rounded-2xl p-5 cursor-pointer hover:shadow-md active:scale-95 transition-all ${
                      selectedWallet === wallet.id ? 'ring-2 ring-[#00C2A8]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <div className="w-6 h-6 rounded-full bg-white/30" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-900">{wallet.name}</h3>
                      </div>
                      {selectedWallet === wallet.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-[#00C2A8] flex items-center justify-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <h1 className="text-2xl text-slate-900">{t.transactionTitle}</h1>
                <Badge className="bg-green-100 text-green-700 border-0">
                  {t.lowFee}
                </Badge>
              </div>

              <Card className="bg-white border-0 shadow-lg rounded-2xl p-6 mb-6">
                <div className="space-y-4">
                  {/* To */}
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{t.to}</p>
                    <p className="text-slate-900">{t.merchant}</p>
                  </div>

                  {/* Amount */}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">{t.amount}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl text-slate-900">
                        {currency === 'USDC' ? `${cryptoAmount} USDC` : `¥${cryptoAmount} JPYC`}
                      </span>
                      {currency === 'USDC' && (
                        <span className="text-slate-400">≈ ¥{totalAmount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Network Fee */}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">{t.networkFee}</p>
                    <p className="text-slate-900">{gasFee} gas</p>
                  </div>

                  {/* Payment ID */}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">{t.paymentId}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                        #ABC123
                      </code>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Button 
                onClick={onConfirm}
                className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30 active:scale-95 transition-transform mb-4"
              >
                {t.confirm}
              </Button>

              <p className="text-xs text-center text-slate-400">{t.footer}</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
