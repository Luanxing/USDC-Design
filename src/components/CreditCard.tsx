import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';

interface CreditCardProps {
  onSuccess: () => void;
  onBack: () => void;
  language: 'en' | 'ja' | 'zh';
  totalAmount: number;
}

interface Card {
  id: string;
  name: string;
  type: string;
  gradient: string;
  textColor: string;
  logo?: string;
}

export function CreditCard({ onSuccess, onBack, language, totalAmount }: CreditCardProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cards: Card[] = [
    {
      id: 'rakuten',
      name: 'Rakuten Card',
      type: '•••• 1234',
      gradient: 'from-slate-200 to-slate-300',
      textColor: 'text-slate-900'
    },
    {
      id: 'black',
      name: 'Premium Card',
      type: '•••• 5678',
      gradient: 'from-slate-800 to-slate-900',
      textColor: 'text-white'
    },
    {
      id: 'tpoint',
      name: 'Tポイントカード',
      type: '•••• 9012',
      gradient: 'from-blue-600 via-blue-500 to-yellow-400',
      textColor: 'text-white'
    },
    {
      id: 'line',
      name: 'LINE Pay Card',
      type: '•••• 3456',
      gradient: 'from-green-400 to-green-500',
      textColor: 'text-white'
    },
    {
      id: 'olive',
      name: 'Olive Card',
      type: '•••• 7890',
      gradient: 'from-slate-600 to-slate-700',
      textColor: 'text-white'
    },
    {
      id: 'amex',
      name: 'American Express',
      type: '•••• 2468',
      gradient: 'from-yellow-600 via-yellow-500 to-yellow-400',
      textColor: 'text-slate-900'
    }
  ];

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handlePay = () => {
    if (!selectedCard) return;
    setIsProcessing(true);
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const text = {
    en: {
      title: 'Select Card',
      subtitle: 'Choose a card to pay',
      pay: `Pay ¥${totalAmount.toLocaleString()}`,
      processing: 'Processing...',
      selectCard: 'Please select a card',
      contactless: 'Contactless'
    },
    ja: {
      title: 'お支払いカードを選択',
      subtitle: 'ご利用になるカードを選んでください',
      pay: `¥${totalAmount.toLocaleString()} のお支払いへ進む`,
      processing: '処理中...',
      selectCard: 'カードをお選びください',
      contactless: 'タッチ決済対応'
    },
    zh: {
      title: '选择卡片',
      subtitle: '选择用于支付的卡片',
      pay: `支付¥${totalAmount.toLocaleString()}`,
      processing: '处理中...',
      selectCard: '请选择卡片',
      contactless: '非接触式'
    }
  };

  const t = text[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex-shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform mb-4"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl text-white mb-1">{t.title}</h1>
        <p className="text-sm text-white/60">{t.subtitle}</p>
      </div>

      {/* Cards Stack */}
      <div className="flex-1 relative px-6 overflow-y-auto pb-6">
        <div className="relative h-full">
          <AnimatePresence>
            {cards.map((card, index) => {
              const isSelected = selectedCard === card.id;
              const baseOffset = index * 30;
              const selectedOffset = isSelected ? 0 : index > cards.findIndex(c => c.id === selectedCard) ? (index - cards.findIndex(c => c.id === selectedCard)) * 30 : index * 30;
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ y: baseOffset, scale: 1 - index * 0.05 }}
                  animate={{
                    y: selectedCard ? selectedOffset : baseOffset,
                    scale: isSelected ? 1 : 1 - (selectedCard ? 0 : index) * 0.05,
                    zIndex: isSelected ? 100 : cards.length - index
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                  onClick={() => handleCardSelect(card.id)}
                  className="absolute top-0 left-0 right-0 cursor-pointer"
                  style={{ zIndex: isSelected ? 100 : cards.length - index }}
                >
                  <div 
                    className={`relative w-full h-52 rounded-3xl bg-gradient-to-br ${card.gradient} shadow-2xl p-6 flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Contactless Icon */}
                    <div className="absolute top-6 right-6">
                      <div className={`${card.textColor} opacity-40`}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 18a6 6 0 0 0 0-12" />
                          <path d="M12 18a9 9 0 0 0 0-12" />
                          <path d="M12 18a12 12 0 0 0 0-12" />
                        </svg>
                      </div>
                    </div>

                    {/* Card Brand Logo */}
                    {card.id === 'rakuten' && (
                      <div className="text-red-600 text-xl">Rakuten</div>
                    )}
                    {card.id === 'tpoint' && (
                      <div className="flex items-center gap-2">
                        <div className="bg-white rounded-lg px-2 py-1">
                          <span className="text-blue-600 text-sm">Tポイント</span>
                        </div>
                      </div>
                    )}
                    {card.id === 'olive' && (
                      <div className={`text-xl ${card.textColor}`}>Olive</div>
                    )}
                    {card.id === 'amex' && (
                      <div className={`text-lg ${card.textColor}`}>AMERICAN EXPRESS</div>
                    )}

                    <div className="mt-auto">
                      {/* Card Number */}
                      <p className={`text-lg mb-3 tracking-wider ${card.textColor} font-mono`}>
                        {card.type}
                      </p>

                      {/* Card Name */}
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${card.textColor} opacity-80`}>
                          {card.name}
                        </p>
                        
                        {/* Selection Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 rounded-full bg-[#00C2A8] flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Card Pattern/Decoration */}
                    <div className={`absolute inset-0 opacity-10 ${card.textColor}`}>
                      <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-current" />
                      <div className="absolute -left-10 top-10 w-32 h-32 rounded-full bg-current" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-6 pb-6 pt-4 flex-shrink-0">
        <Button
          onClick={handlePay}
          disabled={!selectedCard || isProcessing}
          className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>{t.processing}</span>
            </motion.div>
          ) : selectedCard ? (
            t.pay
          ) : (
            t.selectCard
          )}
        </Button>
      </div>
    </div>
  );
}