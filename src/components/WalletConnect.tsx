import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Currency, Network } from '../types/order';

const POLYGON_TESTNET_CHAIN_ID = 80002;
const POLYGON_TESTNET_HEX_CHAIN_ID = '0x13882';
const POLYGON_TESTNET_NAME = 'Polygon Amoy Testnet';
const POLYGON_TESTNET_EXPLORER = 'https://amoy.polygonscan.com';
const USDC_METHOD_TRANSFER = '0xa9059cbb';
const USDC_DECIMALS = 6;
const MAX_CONFIRMATION_ATTEMPTS = 30;
const CONFIRMATION_POLL_INTERVAL_MS = 4000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const toUsdcUnits = (value: string) => {
  const [wholePart, fractionPart = ''] = value.split('.');
  const sanitizedWhole = wholePart.replace(/[^\d]/g, '') || '0';
  const fractionPadded = (fractionPart.replace(/[^\d]/g, '') + '0'.repeat(USDC_DECIMALS)).slice(0, USDC_DECIMALS);
  return BigInt(`${sanitizedWhole}${fractionPadded}`);
};

const encodeUsdcTransferData = (to: string, amount: bigint) => {
  const addressField = to.replace(/^0x/, '').padStart(64, '0').toLowerCase();
  const amountField = amount.toString(16).padStart(64, '0');
  return `${USDC_METHOD_TRANSFER}${addressField}${amountField}`;
};

interface WalletConnectProps {
  onConfirm: () => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
  currency: Currency;
  network: Network;
  totalAmount: number;
  defaultWalletId?: string;
  autoConnectAndPay?: boolean;
}

export function WalletConnect({
  onConfirm,
  onBack,
  language,
  currency,
  network,
  totalAmount,
  defaultWalletId,
  autoConnectAndPay,
}: WalletConnectProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkReady, setNetworkReady] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autoInitiatedRef = useRef(false);

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
      lowFee: 'Low Fee / Instant Settlement',
      connectMetaMask: 'Connect MetaMask',
      openMetaMaskApp: 'Open MetaMask App',
      connecting: 'Connecting…',
      connected: 'Wallet connected',
      switchNetwork: 'Switching network…',
      networkReady: 'Polygon Testnet ready',
      paying: 'Submitting payment…',
      paymentSuccess: 'Payment submitted! Waiting for confirmation…',
      confirmed: 'Payment confirmed on-chain',
      viewOnExplorer: 'View on Polygonscan',
      missingConfig: 'Missing merchant or token address. Please configure environment variables.',
      metaMaskNotFound: 'MetaMask not detected. Please install MetaMask or open in the MetaMask app.',
      mobileHint: 'If you are on mobile, please open this page inside the MetaMask browser.',
      retry: 'Try again',
      continueWithoutMetaMask: 'Continue without MetaMask',
      amountUnavailable: 'Unable to determine USDC amount for this currency.',
      connectWalletFirst: 'Please connect MetaMask before paying.',
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
      lowFee: '低手数料・即時決済',
      connectMetaMask: 'MetaMaskを接続する',
      openMetaMaskApp: 'MetaMaskアプリを開く',
      connecting: '接続中…',
      connected: 'ウォレットに接続しました',
      switchNetwork: 'ネットワーク切替中…',
      networkReady: 'Polygonテストネット準備完了',
      paying: '支払いを送信中…',
      paymentSuccess: 'トランザクション送信済み、確認待ち…',
      confirmed: 'チェーン上で支払いが確認されました',
      viewOnExplorer: 'Polygonscanで表示',
      missingConfig: '加盟店またはトークンアドレスが未設定です。環境変数を設定してください。',
      metaMaskNotFound: 'MetaMaskが見つかりません。インストールするか、MetaMaskアプリ内で開いてください。',
      mobileHint: 'スマホの場合はMetaMaskアプリ内ブラウザでこのページを開いてください。',
      retry: '再試行',
      continueWithoutMetaMask: 'MetaMaskを使用せずに続行',
      amountUnavailable: 'この通貨のUSDC金額を取得できません。',
      connectWalletFirst: '支払い前にMetaMaskを接続してください。',
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
      lowFee: '低费用 / 即时结算',
      connectMetaMask: '连接 MetaMask',
      openMetaMaskApp: '打开 MetaMask App',
      connecting: '连接中…',
      connected: '钱包连接成功',
      switchNetwork: '切换网络中…',
      networkReady: 'Polygon 测试网已就绪',
      paying: '提交支付中…',
      paymentSuccess: '交易已提交，等待确认…',
      confirmed: '链上支付已确认',
      viewOnExplorer: '在 Polygonscan 查看',
      missingConfig: '缺少商户或代币地址，请配置环境变量。',
      metaMaskNotFound: '未检测到 MetaMask，请安装浏览器插件或在 MetaMask App 中打开此页面。',
      mobileHint: '如使用手机，请在 MetaMask 内置浏览器中打开此页面。',
      retry: '重试',
      continueWithoutMetaMask: '无需 MetaMask 继续',
      amountUnavailable: '无法计算当前币种对应的 USDC 金额。',
      connectWalletFirst: '请先连接 MetaMask 再进行支付。',
    }
  };

  const t = text[language];

  // 固定测试金额：默认 0.01 USDC，可用 ?usdc= 覆盖
  const searchParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);
  const forcedTestUsdc = useMemo(() => {
    try {
      const s = (searchParams.get('usdc') || '').trim();
      const n = Number(s);
      if (Number.isFinite(n) && n > 0) return n.toFixed(2);
      return '0.01';
    } catch {
      return '0.01';
    }
  }, [searchParams]);

  const cryptoAmount = currency === 'USDC'
    ? forcedTestUsdc
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

  const polygonTestnetHexChainId = POLYGON_TESTNET_HEX_CHAIN_ID;
  const merchantAddress = '0x3f0622f39a62a3d4886a5ed4e242cac9ed837101' as const;
  const usdcContractAddress = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0E7582' as const;
  const polygonPublicRpc = 'https://rpc-amoy.polygon.technology';

  const isMobile = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|Android/i.test(navigator.userAgent);
  }, []);

  const isMetaMaskMobileBrowser = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /MetaMaskMobile/i.test(navigator.userAgent);
  }, []);

  const metaMaskDeepLink = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(window.location.search);
      const orderId = searchParams.get('orderId') ?? 'DEMO-ORDER-001';
      const query = new URLSearchParams({
        orderId,
        amount: totalAmount.toString(),
        lang: language,
        displayCurrency: currency === 'USDC' ? 'JPY' : currency,
      }).toString();
      const domainAndPath = `${url.host}/checkout-demo?${query}`;
      return `https://metamask.app.link/dapp/${domainAndPath}`;
    } catch {
      return null;
    }
  }, [currency, language, totalAmount]);

  const isMetaMaskSelected = selectedWallet === 'metamask';
  const [ethereum, setEthereum] = useState<any>(
    typeof window !== 'undefined' ? (window as any).ethereum : undefined,
  );
  const isMetaMaskAvailable = Boolean(ethereum?.isMetaMask);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleEthereumReady = () => {
      setEthereum((window as any).ethereum);
    };

    if ((window as any).ethereum) {
      handleEthereumReady();
    } else {
      window.addEventListener('ethereum#initialized', handleEthereumReady, { once: true });
      const timeout = window.setTimeout(handleEthereumReady, 2000);
      return () => {
        window.removeEventListener('ethereum#initialized', handleEthereumReady as any);
        window.clearTimeout(timeout);
      };
    }

    return () => undefined;
  }, []);

  const resetTransactionState = () => {
    autoInitiatedRef.current = false;
    setAccount(null);
    setNetworkReady(false);
    setTransactionHash(null);
    setTransactionConfirmed(false);
    setErrorMessage(null);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!defaultWalletId) return;
    if (selectedWallet === defaultWalletId && showTransaction) return;
    setSelectedWallet(defaultWalletId);
    setShowTransaction(true);
  }, [defaultWalletId, selectedWallet, showTransaction]);

  const handleWalletSelect = (walletId: string) => {
    resetTransactionState();
    setSelectedWallet(walletId);
    setShowTransaction(false);
    setTimeout(() => setShowTransaction(true), 800);
  };

  const ensurePolygonTestnet = async () => {
    if (!ethereum) {
      throw new Error(t.metaMaskNotFound);
    }
    const currentChainId = await ethereum.request({ method: 'eth_chainId' });
    if (currentChainId === polygonTestnetHexChainId) {
      setNetworkReady(true);
      return;
    }

    setErrorMessage(null);
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: polygonTestnetHexChainId }],
      });
      setNetworkReady(true);
      return;
    } catch (switchError: any) {
      if (switchError?.code !== 4902) {
        throw switchError;
      }
    }

    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: polygonTestnetHexChainId,
        chainName: POLYGON_TESTNET_NAME,
        rpcUrls: [polygonPublicRpc],
        blockExplorerUrls: [POLYGON_TESTNET_EXPLORER],
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
      }],
    });
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: polygonTestnetHexChainId }],
    });
    setNetworkReady(true);
  };

  const connectMetaMask = async (): Promise<boolean> => {
    if (!isMetaMaskSelected) return false;

    if (!ethereum) {
      if ((isMetaMaskMobileBrowser || isMetaMaskSelected) && !isMetaMaskAvailable) {
        setErrorMessage(t.metaMaskNotFound);
        return false;
      }
      if (isMobile && metaMaskDeepLink) {
        window.open(metaMaskDeepLink, '_self');
        return false;
      }
      setErrorMessage(t.metaMaskNotFound);
      return false;
    }

    try {
      setIsConnecting(true);
      setErrorMessage(null);
      const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) {
        throw new Error('No account returned from MetaMask.');
      }
      setAccount(accounts[0]);
      await ensurePolygonTestnet();
      return true;
    } catch (error: any) {
      setErrorMessage(error?.message ?? t.metaMaskNotFound);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!isMetaMaskSelected) {
      onConfirm();
      return;
    }

    if (!ethereum) {
      setErrorMessage(t.metaMaskNotFound);
      return;
    }

    if (!account) {
      setErrorMessage(t.connectWalletFirst);
      return;
    }

    if (!merchantAddress || !usdcContractAddress) {
      setErrorMessage(t.missingConfig);
      return;
    }

    if (currency !== 'USDC') {
      setErrorMessage(t.amountUnavailable);
      return;
    }

    if (Number.isNaN(Number(cryptoAmount))) {
      setErrorMessage(t.amountUnavailable);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setTransactionConfirmed(false);

      await ensurePolygonTestnet();

      const amount = toUsdcUnits(cryptoAmount);
      const data = encodeUsdcTransferData(merchantAddress, amount);

      const hash: string = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: usdcContractAddress,
          data,
          value: '0x0',
        }],
      });

      setTransactionHash(hash);
      setErrorMessage(null);

      const waitForTransactionConfirmation = async () => {
        for (let attempt = 0; attempt < MAX_CONFIRMATION_ATTEMPTS; attempt += 1) {
          const receipt = await ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [hash],
          });
          if (receipt) {
            return receipt;
          }
          await sleep(CONFIRMATION_POLL_INTERVAL_MS);
        }
        throw new Error('Transaction confirmation timeout. Please verify on Polygonscan.');
      };

      await waitForTransactionConfirmation();
      setTransactionConfirmed(true);
      setIsSubmitting(false);
      onConfirm();
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Unknown error');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!autoConnectAndPay) return;
    if (!isMetaMaskSelected) return;
    if (autoInitiatedRef.current) return;

    autoInitiatedRef.current = true;
    (async () => {
      const connected = await connectMetaMask();
      if (!connected) {
        autoInitiatedRef.current = false;
        return;
      }
      await handleSubmitPayment();
    })();
  }, [autoConnectAndPay, isMetaMaskSelected]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex-shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 overflow-y-auto pb-8">
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
              {isMetaMaskSelected && (
                <Card className="bg-white border-0 shadow-lg rounded-2xl p-5 mb-4 space-y-3">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-slate-900">
                      MetaMask · Polygon Testnet
                    </h2>
                    {!account ? (
                      <>
                        <Button
                          onClick={connectMetaMask}
                          disabled={isConnecting}
                          className="h-11 rounded-xl bg-[#f6851b] hover:bg-[#d97316] text-white"
                        >
                          {isConnecting ? t.connecting : t.connectMetaMask}
                        </Button>
                        {isMobile && metaMaskDeepLink && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(metaMaskDeepLink, '_self')}
                            className="h-11 rounded-xl border-[#f6851b]/40 text-[#f6851b]"
                          >
                            {t.openMetaMaskApp}
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <p className="font-medium">{t.connected}</p>
                        <p className="truncate text-xs text-green-600 mt-1">{account}</p>
                      </div>
                    )}

                    {account && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 space-y-2">
                        <p>
                          {networkReady ? (
                            <span className="text-green-600 font-medium">{t.networkReady}</span>
                          ) : (
                            <span className="text-slate-600">{t.switchNetwork}</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">
                          Chain ID: {polygonTestnetHexChainId}
                        </p>
                      </div>
                    )}

                    {errorMessage && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 space-y-2">
                        <p className="font-medium">{errorMessage}</p>
                        {isMobile && !isMetaMaskAvailable && (
                          <p className="text-xs text-red-500">{t.mobileHint}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={connectMetaMask}
                            disabled={isConnecting}
                          >
                            {t.retry}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedWallet(null);
                              setShowTransaction(false);
                            }}
                          >
                            {t.continueWithoutMetaMask}
                          </Button>
                        </div>
                      </div>
                    )}

                    {transactionHash && (
                      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 space-y-1">
                        <p className="font-medium">
                          {transactionConfirmed ? t.confirmed : t.paymentSuccess}
                        </p>
                        <p className="text-xs truncate text-blue-600">{transactionHash}</p>
                        <Button
                          size="sm"
                          variant="link"
                          className="px-0 text-blue-600"
                          onClick={() =>
                            window.open(`https://mumbai.polygonscan.com/tx/${transactionHash}`, '_blank', 'noopener')
                          }
                        >
                          {t.viewOnExplorer}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-2xl text-slate-900">{t.transactionTitle}</h1>
                <Badge className="bg-green-100 text-green-700 border-0">
                  {t.lowFee}
                </Badge>
              </div>

              <Card className="bg-white border-0 shadow-lg rounded-2xl p-5 mb-4">
                <div className="space-y-3">
                  {/* To */}
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{t.to}</p>
                    <p className="text-slate-900">{t.merchant}</p>
                  </div>

                  {/* Amount */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">{t.amount}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl text-slate-900">
                        {currency === 'USDC' ? `${cryptoAmount} USDC` : `¥${cryptoAmount} JPYC`}
                      </span>
                      {currency === 'USDC' && (
                        <span className="text-sm text-slate-400">≈ ¥{totalAmount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Network Fee */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">{t.networkFee}</p>
                    <p className="text-slate-900">{gasFee} gas</p>
                  </div>

                  {/* Payment ID */}
                  <div className="pt-3 border-t border-slate-100">
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
                onClick={handleSubmitPayment}
                disabled={
                  (isMetaMaskSelected && (!account || !networkReady || isSubmitting)) ||
                  (currency === 'USDC' ? false : isMetaMaskSelected)
                }
                className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30 active:scale-95 transition-transform mb-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isMetaMaskSelected && isSubmitting ? t.paying : t.confirm}
              </Button>

              <p className="text-xs text-center text-slate-400">{t.footer}</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}