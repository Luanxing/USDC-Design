import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { CartItem } from '../types/order';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ExchangePayProps {
  exchangeName: 'Binance' | 'OKX' | 'Bybit' | 'Coinbase';
  merchantId: string;
  onSuccess: () => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
  totalAmount: number;
  cart: CartItem[];
}

export function ExchangePay({ exchangeName, merchantId, onSuccess, onBack, language, totalAmount, cart }: ExchangePayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Use fallback method that works in all environments
    const textArea = document.createElement('textarea');
    textArea.value = merchantId;
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

  const exchangeColors = {
    Binance: { from: '#FFD34E', to: '#FFC107', text: '#000', bg: '#FFF9E6' },
    OKX: { from: '#000000', to: '#333333', text: '#FFF', bg: '#F5F5F5' },
    Bybit: { from: '#F7A600', to: '#E69500', text: '#000', bg: '#FFF5E6' },
    Coinbase: { from: '#0052FF', to: '#0041CC', text: '#FFF', bg: '#E6F0FF' }
  };

  const colors = exchangeColors[exchangeName];

  // Calculate USDC amount (JPY to USD conversion rate ~151)
  const usdcAmount = (totalAmount / 151).toFixed(2);

  const text = {
    en: {
      title: `Pay with ${exchangeName}`,
      totalPayment: 'Total Payment',
      merchantId: `Merchant ${exchangeName} ID`,
      tapToCopy: 'Tap to copy',
      howToPay: 'How to transfer',
      // Binance steps
      step1Title: 'Copy Merchant ID',
      step1Desc: 'Tap the ID above to copy',
      step2Title: `Open ${exchangeName} Pay`,
      step2Desc: 'Launch your app and tap "Send"',
      step3Title: 'Paste & Enter Amount',
      step3Desc: `Paste ID and enter ${usdcAmount} USDC`,
      step4Title: 'Confirm Payment',
      step4Desc: 'Review and complete transfer',
      // OKX specific steps
      okxStep1Title: 'Copy Merchant ID',
      okxStep1Desc: 'Tap the ID above to copy',
      okxStep2Title: 'Go to Assets - Withdraw',
      okxStep2Desc: 'Open OKX app and navigate to Withdraw',
      okxStep3Title: 'Select Withdraw Crypto',
      okxStep3Desc: 'Choose "Withdraw crypto" option',
      okxStep4Title: 'Choose USDC Currency',
      okxStep4Desc: 'Select USDC from the currency list',
      okxStep5Title: 'Select OKX Users',
      okxStep5Desc: 'Choose "OKX users" transfer method',
      okxStep6Title: 'Paste Merchant ID',
      okxStep6Desc: `Paste ID and enter ${usdcAmount} USDC`,
      okxStep7Title: 'Confirm Payment',
      okxStep7Desc: 'Review and complete transfer',
      // Bybit specific steps
      bybitStep1Title: 'Copy Merchant Bybit ID',
      bybitStep1Desc: 'Tap the ID above to copy',
      bybitStep2Title: 'Open Assets - Withdraw',
      bybitStep2Desc: 'Go to "Assets" and select "Withdraw"',
      bybitStep3Title: 'Select USDC Currency',
      bybitStep3Desc: 'Choose USDC from crypto list',
      bybitStep4Title: 'Select Internal Transfer',
      bybitStep4Desc: 'Choose "Bybit internal transfer" and paste UID',
      bybitStep5Title: 'Enter Amount & Confirm',
      bybitStep5Desc: `Enter ${usdcAmount} USDC and press withdraw`,
      copyId: 'Copy ID',
      copied: 'Copied!',
      openApp: `Open ${exchangeName}`,
      completed: 'Payment Completed',
      changeMethod: 'Change Method'
    },
    ja: {
      title: `${exchangeName} でお支払い`,
      totalPayment: 'お支払い総額',
      merchantId: `加盟店 ${exchangeName} ID`,
      tapToCopy: 'タップしてコピー',
      howToPay: '送金手順',
      // Binance steps
      step1Title: '加盟店IDをコピー',
      step1Desc: '上記のIDをタップしてコピー',
      step2Title: `${exchangeName} Pay を開く`,
      step2Desc: 'アプリを起動して「送信」をタップ',
      step3Title: 'ID貼付と金額入力',
      step3Desc: `IDを貼り付けて ${usdcAmount} USDC を入力`,
      step4Title: 'お支払いを確認',
      step4Desc: '内容を確認して送金完了',
      // OKX specific steps
      okxStep1Title: '加盟店IDをコピー',
      okxStep1Desc: '上記のIDをタップしてコピー',
      okxStep2Title: 'Assets - Withdraw へ移動',
      okxStep2Desc: 'OKXアプリで「出金」に移動',
      okxStep3Title: '暗号資産の出金を選択',
      okxStep3Desc: '「Withdraw crypto」を選択',
      okxStep4Title: 'USDCを選択',
      okxStep4Desc: '通貨リストからUSDCを選択',
      okxStep5Title: 'OKXユーザーを選択',
      okxStep5Desc: '「OKX users」送金方法を選択',
      okxStep6Title: '加盟店IDを貼付',
      okxStep6Desc: `IDを貼り付けて ${usdcAmount} USDC を入力`,
      okxStep7Title: 'お支払いを確認',
      okxStep7Desc: '内容を確認して送金完了',
      // Bybit specific steps
      bybitStep1Title: '店のBybit IDをコピー',
      bybitStep1Desc: '上記のIDをタップしてコピー',
      bybitStep2Title: '「資産」を開いて「出金」を選択',
      bybitStep2Desc: '「資産」から「出金」に移動',
      bybitStep3Title: '暗号資産リストでUSDCを選択',
      bybitStep3Desc: '暗号資産リストからUSDCを選択',
      bybitStep4Title: '「Bybit内送金」を選択しUIDを貼付',
      bybitStep4Desc: '「Bybit内送金」を選択し、UIDを貼り付ける',
      bybitStep5Title: '出金金額を入力して出金',
      bybitStep5Desc: `${usdcAmount} USDC を入力して、出金ボタンを押す`,
      copyId: 'IDをコピー',
      copied: 'コピーしました！',
      openApp: `${exchangeName} を開く`,
      completed: 'お支払い完了',
      changeMethod: '支払い方法を変更'
    },
    zh: {
      title: `使用 ${exchangeName} 支付`,
      totalPayment: '支付总额',
      merchantId: `商家 ${exchangeName} ID`,
      tapToCopy: '点击复制',
      howToPay: '转账步骤',
      // Binance steps
      step1Title: '复制商家ID',
      step1Desc: '点击上方ID进行复制',
      step2Title: `打开 ${exchangeName} Pay`,
      step2Desc: '启动应用并点击"发送"',
      step3Title: '粘贴并输入金额',
      step3Desc: `粘贴ID并输入 ${usdcAmount} USDC`,
      step4Title: '确认支付',
      step4Desc: '检查信息并完成转账',
      // OKX specific steps
      okxStep1Title: '复制商家ID',
      okxStep1Desc: '点击上方ID进行复制',
      okxStep2Title: '前往 Assets - Withdraw',
      okxStep2Desc: '打开OKX应用进入提现页面',
      okxStep3Title: '选择提现加密货币',
      okxStep3Desc: '选择"Withdraw crypto"选项',
      okxStep4Title: '选择USDC币种',
      okxStep4Desc: '从币种列表中选择USDC',
      okxStep5Title: '选择OKX用户',
      okxStep5Desc: '选择"OKX users"转账方式',
      okxStep6Title: '粘贴商家ID',
      okxStep6Desc: `粘贴ID并输入 ${usdcAmount} USDC`,
      okxStep7Title: '确认支付',
      okxStep7Desc: '检查信息并完成转账',
      // Bybit specific steps
      bybitStep1Title: '复制商家Bybit ID',
      bybitStep1Desc: '点击上方ID进行复制',
      bybitStep2Title: '打开资产 - 提现',
      bybitStep2Desc: '前往"资产"并选择"提现"',
      bybitStep3Title: '选择USDC币种',
      bybitStep3Desc: '从加密货币列表中选择USDC',
      bybitStep4Title: '选择内部转账并粘贴UID',
      bybitStep4Desc: '选择"Bybit内部转账"，粘贴UID',
      bybitStep5Title: '输入金额并确认',
      bybitStep5Desc: `输入 ${usdcAmount} USDC 并按下提现`,
      copyId: '复制ID',
      copied: '已复制！',
      openApp: `打开 ${exchangeName}`,
      completed: '支付完成',
      changeMethod: '更换方式'
    }
  };

  const t = text[language];

  // Different steps for different exchanges
  const steps = exchangeName === 'OKX' ? [
    { title: t.okxStep1Title, desc: t.okxStep1Desc },
    { title: t.okxStep2Title, desc: t.okxStep2Desc },
    { title: t.okxStep3Title, desc: t.okxStep3Desc },
    { title: t.okxStep4Title, desc: t.okxStep4Desc },
    { title: t.okxStep5Title, desc: t.okxStep5Desc },
    { title: t.okxStep6Title, desc: t.okxStep6Desc },
    { title: t.okxStep7Title, desc: t.okxStep7Desc }
  ] : exchangeName === 'Bybit' ? [
    { title: t.bybitStep1Title, desc: t.bybitStep1Desc },
    { title: t.bybitStep2Title, desc: t.bybitStep2Desc },
    { title: t.bybitStep3Title, desc: t.bybitStep3Desc },
    { title: t.bybitStep4Title, desc: t.bybitStep4Desc },
    { title: t.bybitStep5Title, desc: t.bybitStep5Desc }
  ] : [
    { title: t.step1Title, desc: t.step1Desc },
    { title: t.step2Title, desc: t.step2Desc },
    { title: t.step3Title, desc: t.step3Desc },
    { title: t.step4Title, desc: t.step4Desc }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 flex-shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform mb-6"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        
        <div className="flex items-center gap-3">
          {/* Exchange Icon */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0"
            style={{ 
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` 
            }}
          >
            <div className="w-9 h-9 rounded-full bg-white/40" />
          </motion.div>
          <div>
            <h1 className="text-2xl text-slate-900">{t.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 overflow-y-auto pb-6 space-y-5">
        
        {/* Order Summary Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-0 shadow-lg rounded-3xl p-5">
            <h3 className="text-slate-500 text-sm mb-4">
              {language === 'en' ? 'Order Summary' : language === 'ja' ? 'ご注文内容' : '订单摘要'}
            </h3>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {cart.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">
                      {language === 'en' ? item.name : item.nameJa}
                    </p>
                    <p className="text-xs text-slate-500">
                      ¥{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-slate-900 flex-shrink-0">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 my-4" />

            {/* Payment Method */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">
                {language === 'en' ? 'Payment Method' : language === 'ja' ? 'お支払い方法' : '支付方式'}
              </span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` 
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                </div>
                <span className="text-sm text-slate-900">{exchangeName} Pay</span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">
                {language === 'en' ? 'Subtotal' : language === 'ja' ? '小計' : '小计'}
              </span>
              <span className="text-sm text-slate-900">¥{totalAmount.toLocaleString()}</span>
            </div>

            {/* USDC Equivalent */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">
                {language === 'en' ? 'USDC Amount' : language === 'ja' ? 'USDC 換算額' : 'USDC 金额'}
              </span>
              <span className="text-sm text-[#00C2A8]">{usdcAmount} USDC</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200 my-3" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-slate-900">
                {language === 'en' ? 'Total' : language === 'ja' ? 'お会計' : '总计'}
              </span>
              <span className="text-2xl text-slate-900">¥{totalAmount.toLocaleString()}</span>
            </div>
          </Card>
        </motion.div>

        {/* Merchant ID Card - Very Prominent */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="border-2 border-dashed rounded-3xl p-6 cursor-pointer active:scale-[0.98] transition-transform"
            style={{ 
              borderColor: colors.from,
              backgroundColor: colors.bg
            }}
            onClick={handleCopy}
          >
            <p className="text-sm text-slate-600 mb-3">{t.merchantId}</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-2xl text-slate-900 tracking-wider tabular-nums flex-1">
                {merchantId}
              </code>
              <motion.div
                animate={copied ? { scale: [1, 1.2, 1] } : {}}
                className="flex-shrink-0"
              >
                {copied ? (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center"
                    style={{ borderColor: colors.from }}
                  >
                    <Copy className="w-5 h-5" style={{ color: colors.from }} />
                  </div>
                )}
              </motion.div>
            </div>
            <p className="text-xs text-slate-500 mt-3">{t.tapToCopy}</p>
          </Card>
        </motion.div>

        {/* Instructions Title */}
        <div className="pt-2">
          <h3 className="text-slate-900 text-lg">{t.howToPay}</h3>
        </div>

        {/* Steps - Clean Card Style */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="flex gap-4 items-start">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm shadow-md"
                    style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-slate-900 mb-1">{step.title}</p>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-1" />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={() => {
              // 仅使用 Binance 深链（无网页/商店回退），方便逐步调试
              const ua = navigator.userAgent || '';
              const isIOS = /iPad|iPhone|iPod/.test(ua);
              const scheme = 'binance://';

              // 复制信息，便于在 App 内粘贴
              try {
                const info = `Merchant ID: ${merchantId}\nAmount: ${usdcAmount} USDC`;
                navigator.clipboard?.writeText?.(info);
              } catch {}

              if (isIOS) {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = scheme;
                document.body.appendChild(iframe);
                setTimeout(() => {
                  document.body.removeChild(iframe);
                }, 1200);
              } else {
                window.location.href = scheme;
              }
            }}
            className="w-full h-14 rounded-2xl shadow-xl active:scale-95 transition-transform text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              color: colors.text
            }}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            {t.openApp}
          </Button>
          
          <Button 
            onClick={onSuccess}
            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg active:scale-95 transition-transform"
          >
            <Check className="w-5 h-5 mr-2" />
            {t.completed}
          </Button>

          <Button 
            onClick={onBack}
            variant="ghost"
            className="w-full h-12 rounded-xl text-slate-600 active:scale-95 transition-transform"
          >
            {t.changeMethod}
          </Button>
        </div>
      </div>
    </div>
  );
}