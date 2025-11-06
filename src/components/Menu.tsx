import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Plus, Minus, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import type { MenuItem, CartItem } from '../types/order';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuProps {
  onViewOrder: (cart: CartItem[]) => void;
  onOpenLanguage: () => void;
  language: 'en' | 'ja' | 'zh';
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Ramen Shoyu',
    nameJa: '醤油ラーメン',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1635379511574-bc167ca085c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbiUyMGJvd2wlMjBqYXBhbmVzZXxlbnwxfHx8fDE3NjIwNjcxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'menu'
  },
  {
    id: '2',
    name: 'Tonkatsu Set',
    nameJa: 'とんかつ定食',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1734775373504-ff24ea8419b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b25rYXRzdSUyMGphcGFuZXNlJTIwcG9ya3xlbnwxfHx8fDE3NjIwNjcxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'menu'
  },
  {
    id: '3',
    name: 'Curry Rice',
    nameJa: 'カレーライス',
    price: 900,
    image: 'https://images.unsplash.com/photo-1706145779556-f2c642db2699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGN1cnJ5JTIwcmljZXxlbnwxfHx8fDE3NjIwNjcxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'menu'
  },
  {
    id: '4',
    name: 'Takoyaki (6pcs)',
    nameJa: 'たこ焼き（6個）',
    price: 600,
    image: 'https://images.unsplash.com/photo-1633790450512-98e68a55ef15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWtveWFraSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NjIwNjcxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'specials'
  },
  {
    id: '5',
    name: 'Matcha Latte',
    nameJa: '抹茶ラテ',
    price: 600,
    image: 'https://images.unsplash.com/photo-1582785513054-8d1bf9d69c1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZXxlbnwxfHx8fDE3NjE5ODA4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'drinks'
  },
  {
    id: '6',
    name: 'Green Tea',
    nameJa: '緑茶',
    price: 400,
    image: 'https://images.unsplash.com/photo-1672842700943-b9916abd19fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGdyZWVuJTIwdGVhfGVufDF8fHx8MTc2MjA2NzE3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'drinks'
  }
];

export function Menu({ onViewOrder, onOpenLanguage, language }: MenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'specials' | 'drinks'>('menu');

  const text = {
    en: {
      welcome: 'Welcome to カフェMax',
      location: 'Tokyo, Shibuya',
      menu: 'Menu',
      specials: 'Specials',
      drinks: 'Drinks',
      viewOrder: 'View Order',
      items: 'items'
    },
    ja: {
      welcome: 'カフェMaxへようこそ',
      location: '東京都渋谷区',
      menu: 'お食事',
      specials: '本日のおすすめ',
      drinks: 'お飲み物',
      viewOrder: 'ご注文内容を確認する',
      items: '点'
    },
    zh: {
      welcome: '欢迎来到カフェMax',
      location: '东京，涩谷',
      menu: '菜单',
      specials: '特色推荐',
      drinks: '饮品',
      viewOrder: '查看订单',
      items: '件'
    }
  };

  const t = text[language];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const getItemQuantity = (itemId: string) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = menuItems.filter(item => item.category === activeTab);

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl text-slate-900">{t.welcome}</h1>
            <p className="text-sm text-slate-500">{t.location}</p>
          </div>
          <button 
            onClick={onOpenLanguage}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Globe className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="menu" className="flex-1 rounded-lg">{t.menu}</TabsTrigger>
            <TabsTrigger value="specials" className="flex-1 rounded-lg">{t.specials}</TabsTrigger>
            <TabsTrigger value="drinks" className="flex-1 rounded-lg">{t.drinks}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 gap-4 pb-24">
          {filteredItems.map((item, index) => {
            const quantity = getItemQuantity(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 shadow-md rounded-2xl overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-slate-900 mb-1">
                          {language === 'en' ? item.name : item.nameJa}
                        </h3>
                        <p className="text-xl text-[#00C2A8]">¥{item.price.toLocaleString()}</p>
                      </div>
                      
                      {quantity === 0 ? (
                        <Button
                          onClick={() => addToCart(item)}
                          size="sm"
                          className="w-full h-9 rounded-lg bg-[#00C2A8] hover:bg-[#00A890] text-white active:scale-95 transition-transform"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            size="sm"
                            variant="outline"
                            className="w-9 h-9 rounded-lg p-0 active:scale-95 transition-transform"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="flex-1 text-center text-slate-900">{quantity}</span>
                          <Button
                            onClick={() => addToCart(item)}
                            size="sm"
                            className="w-9 h-9 rounded-lg p-0 bg-[#00C2A8] hover:bg-[#00A890] text-white active:scale-95 transition-transform"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="absolute bottom-6 left-6 right-6"
        >
          <Button
            onClick={() => onViewOrder(cart)}
            className="w-full h-14 rounded-2xl bg-[#00C2A8] hover:bg-[#00A890] text-white shadow-2xl shadow-[#00C2A8]/40 active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {t.viewOrder} ({totalItems} {t.items})
          </Button>
        </motion.div>
      )}
    </div>
  );
}
