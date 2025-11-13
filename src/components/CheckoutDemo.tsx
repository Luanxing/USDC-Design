import { useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { WalletConnect } from './WalletConnect';
import type { Currency, Network } from '../types/order';

type LanguageCode = 'en' | 'ja' | 'zh';

const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'ja', 'zh'];

const languageCopy: Record<LanguageCode, {
  title: string;
  subtitle: string;
  orderId: string;
  items: string;
  total: string;
  payCta: string;
  successTitle: string;
  successSubtitle: string;
  payAgain: string;
}> = {
  en: {
    title: 'Demo Checkout',
    subtitle: 'Review the mock order and continue with MetaMask to complete payment.',
    orderId: 'Order ID',
    items: 'Items',
    total: 'Total',
    payCta: 'Continue with MetaMask',
    successTitle: 'Payment Initiated',
    successSubtitle: 'The transaction has been submitted via MetaMask. You can review the status in your wallet.',
    payAgain: 'Back to order details',
  },
  ja: {
    title: 'デモ決済',
    subtitle: 'モック注文を確認し、MetaMask で支払いを完了してください。',
    orderId: '注文番号',
    items: '注文内容',
    total: '合計金額',
    payCta: 'MetaMask で続行',
    successTitle: '支払いを開始しました',
    successSubtitle: 'トランザクションは MetaMask から送信されました。ウォレットでステータスを確認できます。',
    payAgain: '注文内容に戻る',
  },
  zh: {
    title: '演示支付',
    subtitle: '确认模拟订单，使用 MetaMask 完成支付。',
    orderId: '订单号',
    items: '商品',
    total: '应付金额',
    payCta: '使用 MetaMask 支付',
    successTitle: '支付已发起',
    successSubtitle: '交易已通过 MetaMask 提交，可在钱包中查看状态。',
    payAgain: '返回订单信息',
  },
};

interface CheckoutDemoProps {
  defaultCurrency?: Currency;
  defaultNetwork?: Network;
}

export function CheckoutDemo({ defaultCurrency = 'USDC', defaultNetwork = 'Polygon' }: CheckoutDemoProps) {
  const [stage, setStage] = useState<'details' | 'wallet' | 'success'>('details');

  const params = useMemo(() => {
    if (typeof window === 'undefined') {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  }, []);

  const language = useMemo<LanguageCode>(() => {
    const langParam = (params.get('lang') || '').toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(langParam as LanguageCode)) {
      return langParam as LanguageCode;
    }
    return 'en';
  }, [params]);

  const orderId = params.get('orderId') || 'DEMO-ORDER-001';
  const amountParam = Number(params.get('amount'));
  const totalAmount = Number.isFinite(amountParam) && amountParam > 0 ? amountParam : 15000;
  const displayCurrency = params.get('displayCurrency') || 'JPY';

  const items = params.getAll('item');
  const demoItems = items.length > 0
    ? items
    : [
        'USDC Checkout Flow Design Retainer (1×)',
        'Priority Onboarding Support (1×)',
      ];

  const t = languageCopy[language];

  if (stage === 'wallet') {
    return (
      <WalletConnect
        onConfirm={() => setStage('success')}
        onBack={() => setStage('details')}
        language={language}
        currency={defaultCurrency}
        network={defaultNetwork}
        totalAmount={totalAmount}
        defaultWalletId="metamask"
        autoConnectAndPay
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-3 text-center">
          <Badge className="bg-[#00C2A8]/10 text-[#008E7D] border-0 px-3 py-1 tracking-wide uppercase">
            Polygon · {defaultCurrency}
          </Badge>
          <h1 className="text-3xl font-semibold text-slate-900">{t.title}</h1>
          <p className="text-slate-500">{t.subtitle}</p>
        </div>

        <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur">
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t.orderId}</p>
              <p className="font-mono text-slate-700 text-sm">{orderId}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t.items}</p>
              <ul className="space-y-2">
                {demoItems.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="text-sm text-slate-700 bg-slate-100/60 border border-slate-200/50 rounded-xl px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.total}</span>
              <div className="text-right">
                <p className="text-2xl font-semibold text-slate-900">
                  {displayCurrency === 'USD' ? `$${totalAmount.toLocaleString()}` : `¥${totalAmount.toLocaleString()}`}
                </p>
                {defaultCurrency === 'USDC' && (
                  <p className="text-xs text-slate-400">
                    ≈ {(totalAmount / 151).toFixed(2)} USDC
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {stage === 'details' && (
          <Button
            className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30"
            onClick={() => setStage('wallet')}
          >
            {t.payCta}
          </Button>
        )}

        {stage === 'success' && (
          <Card className="p-6 rounded-3xl shadow-lg border-0 bg-emerald-50 text-emerald-700 space-y-3 text-center">
            <h2 className="text-xl font-semibold">{t.successTitle}</h2>
            <p className="text-sm text-emerald-600">{t.successSubtitle}</p>
            <Button variant="outline" className="rounded-2xl" onClick={() => setStage('details')}>
              {t.payAgain}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

