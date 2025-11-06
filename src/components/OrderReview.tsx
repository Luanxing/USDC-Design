import { motion } from 'motion/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { SafeCheckoutFooter } from './SafeCheckoutFooter';
import type { CartItem } from '../types/order';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrderReviewProps {
  cart: CartItem[];
  onBack: () => void;
  onCheckout: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  language: 'en' | 'ja' | 'zh';
}

export function OrderReview({ cart, onBack, onCheckout, onUpdateQuantity, language }: OrderReviewProps) {
  const text = {
    en: {
      title: 'Your Order',
      qty: 'Qty',
      subtotal: 'Subtotal',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      empty: 'Your cart is empty'
    },
    ja: {
      title: 'ご注文内容の確認',
      qty: '数量',
      subtotal: '小計',
      total: 'お会計',
      checkout: 'お支払いへ進む',
      empty: 'ご注文はありません'
    },
    zh: {
      title: '您的订单',
      qty: '数量',
      subtotal: '小计',
      total: '总计',
      checkout: '前往结账',
      empty: '购物车为空'
    }
  };

  const t = text[language];

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white shadow-sm">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-4 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl text-slate-900">{t.title}</h1>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {cart.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400">{t.empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 shadow-sm rounded-2xl p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-slate-900 mb-1">
                            {language === 'en' ? item.name : item.nameJa}
                          </h3>
                          <p className="text-sm text-slate-500">¥{item.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 0)}
                          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-3 py-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="text-slate-600 active:scale-90 transition-transform"
                          >
                            −
                          </button>
                          <span className="text-slate-900 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-slate-600 active:scale-90 transition-transform"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-slate-900">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Total and Checkout */}
      {cart.length > 0 && (
        <div className="px-6 pb-8 bg-white shadow-lg">
          <div className="pt-6 mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-slate-500">{t.total}</span>
              <div className="text-3xl text-slate-900">¥{totalAmount.toLocaleString()}</div>
            </div>
          </div>

          <Button
            onClick={onCheckout}
            className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-lg shadow-[#00C2A8]/30 active:scale-95 transition-transform mb-4"
          >
            {t.checkout}
          </Button>

          <SafeCheckoutFooter language={language} />
        </div>
      )}
    </div>
  );
}
