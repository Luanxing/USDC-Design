import { Shield } from 'lucide-react';

interface SafeCheckoutFooterProps {
  language: 'en' | 'ja' | 'zh';
}

export function SafeCheckoutFooter({ language }: SafeCheckoutFooterProps) {
  const text = {
    en: 'Powered by Smartiful Pay • Secure Web3 Checkout',
    ja: 'Smartiful Pay提供 • 安全なWeb3決済',
    zh: 'Smartiful Pay提供 • 安全的Web3结账'
  };
  
  const displayText = text[language];

  return (
    <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-4">
      <Shield className="w-3.5 h-3.5" />
      <span>{displayText}</span>
    </div>
  );
}
