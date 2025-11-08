import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, Globe, Star, TrendingUp, Flame, UtensilsCrossed, Sparkles, Coffee, X, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import type { MenuItem, CartItem } from '../types/order';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuProps {
  onViewOrder: (cart: CartItem[]) => void;
  onOpenLanguage: () => void;
  language: 'en' | 'ja' | 'zh';
}

const menuItems: MenuItem[] = [
  // Main dishes - 3 items
  {
    id: '1',
    name: 'Ramen Shoyu',
    nameJa: '醤油ラーメン',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1635379511574-bc167ca085c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbiUyMGJvd2wlMjBqYXBhbmVzZXxlbnwxfHx8fDE3NjIwNjcxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'menu',
    description: 'Classic soy sauce ramen with pork',
    descriptionJa: '豚骨スープの醤油ラーメン',
    rating: 4.8,
    isPopular: true
  },
  {
    id: '2',
    name: 'Tonkatsu Set',
    nameJa: 'とんかつ定食',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1734775373504-ff24ea8419b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b25rYXRzdSUyMGphcGFuZXNlJTIwcG9ya3xlbnwxfHx8fDE3NjIwNjcxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'menu',
    description: 'Breaded pork cutlet with rice & miso soup',
    descriptionJa: '衣がサクサクのとんかつ定食',
    rating: 4.9,
    isPopular: true
  },
  {
    id: '7',
    name: 'Sushi Platter',
    nameJa: '寿司盛り合わせ',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1666405483372-5cd114fc8166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXRlJTIwamFwYW5lc2V8ZW58MXx8fHwxNzYyNTYzMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'menu',
    description: 'Assorted fresh sushi (12 pieces)',
    descriptionJa: '新鮮なお寿司の盛り合わせ（12貫）',
    rating: 4.9
  },
  
  // Specials - 3 items
  {
    id: '4',
    name: 'Takoyaki (6pcs)',
    nameJa: 'たこ焼き（6個）',
    price: 600,
    image: 'https://images.unsplash.com/photo-1633790450512-98e68a55ef15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWtveWFraSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NjIwNjcxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'specials',
    description: 'Octopus balls with special sauce',
    descriptionJa: 'タコ入りのたこ焼き',
    rating: 4.7,
    isNew: true
  },
  {
    id: '3',
    name: 'Curry Rice',
    nameJa: 'カレーライス',
    price: 900,
    image: 'https://images.unsplash.com/photo-1706145779556-f2c642db2699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGN1cnJ5JTIwcmljZXxlbnwxfHx8fDE3NjIwNjcxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'specials',
    description: 'Japanese style curry with vegetables',
    descriptionJa: '野菜たっぷりの日本式カレー',
    rating: 4.6,
    isSpicy: true,
    isPopular: true
  },
  {
    id: '11',
    name: 'Mochi Ice Cream',
    nameJa: 'もちアイス',
    price: 500,
    image: 'https://images.unsplash.com/photo-1604498149220-bfb7c7cfd19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2NoaSUyMGRlc3NlcnR8ZW58MXx8fHwxNzYyNTM4NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'specials',
    description: 'Japanese ice cream wrapped in mochi',
    descriptionJa: 'もちアイスクリーム',
    rating: 4.6,
    isNew: true
  },
  
  // Drinks - 3 items
  {
    id: '5',
    name: 'Matcha Latte',
    nameJa: '抹茶ラテ',
    price: 600,
    image: 'https://images.unsplash.com/photo-1582785513054-8d1bf9d69c1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZXxlbnwxfHx8fDE3NjE5ODA4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'drinks',
    description: 'Smooth matcha with steamed milk',
    descriptionJa: 'なめらかな抹茶ラテ',
    rating: 4.7,
    isPopular: true
  },
  {
    id: '6',
    name: 'Green Tea',
    nameJa: '緑茶',
    price: 400,
    image: 'https://images.unsplash.com/photo-1672842700943-b9916abd19fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGdyZWVuJTIwdGVhfGVufDF8fHx8MTc2MjA2NzE3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'drinks',
    description: 'Premium Japanese green tea',
    descriptionJa: '高級日本茶',
    rating: 4.5
  },
  {
    id: '14',
    name: 'Yuzu Lemonade',
    nameJa: '柚子レモネード',
    price: 550,
    image: 'https://images.unsplash.com/photo-1728777187089-1af2c5facff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5dXp1JTIwbGVtb25hZGUlMjBkcmlua3xlbnwxfHx8fDE3NjI1NjMwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'drinks',
    description: 'Refreshing yuzu citrus lemonade',
    descriptionJa: 'さわやかな柚子レモネード',
    rating: 4.8,
    isNew: true
  }
];

export function Menu({ onViewOrder, onOpenLanguage, language }: MenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'specials' | 'drinks'>('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const text = {
    en: {
      welcome: 'Welcome to カフェMax',
      location: 'Tokyo, Shibuya',
      menu: 'Menu',
      specials: 'Specials',
      drinks: 'Drinks',
      viewOrder: 'View Order',
      items: 'items',
      total: 'Total',
      clearCart: 'Clear Cart',
      itemDetails: 'Item Details',
      close: 'Close',
      addToCart: 'Add to Cart'
    },
    ja: {
      welcome: 'カフェMaxへようこそ',
      location: '東京都渋谷区',
      menu: 'お食事',
      specials: '本日のおすすめ',
      drinks: 'お飲み物',
      viewOrder: 'ご注文内容を確認する',
      items: '点',
      total: '合計',
      clearCart: 'カートをクリア',
      itemDetails: '商品詳細',
      close: '閉じる',
      addToCart: 'カートに追加'
    },
    zh: {
      welcome: '欢迎来到カフェMax',
      location: '东京，涩谷',
      menu: '菜单',
      specials: '特色推荐',
      drinks: '饮品',
      viewOrder: '查看订单',
      items: '件',
      total: '总计',
      clearCart: '清空购物车',
      itemDetails: '商品详情',
      close: '关闭',
      addToCart: '添加到购物车'
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

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantity = (itemId: string) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredItems = menuItems.filter(item => item.category === activeTab);

  // Get category icon
  const getCategoryIcon = () => {
    switch(activeTab) {
      case 'menu': return <UtensilsCrossed className="w-4 h-4" />;
      case 'specials': return <Sparkles className="w-4 h-4" />;
      case 'drinks': return <Coffee className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#F7F9FB] via-white to-[#E5F8F5]">
      {/* Header with gradient */}
      <div className="px-6 pt-12 pb-4 bg-gradient-to-b from-white to-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl text-slate-900"
            >
              {t.welcome}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-slate-500"
            >
              {t.location}
            </motion.p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenLanguage}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shadow-sm border border-slate-200/50 hover:shadow-md transition-all"
          >
            <Globe className="w-5 h-5 text-slate-600" />
          </motion.button>
        </div>

        {/* Tabs with gradient and smooth animations */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full bg-gradient-to-br from-slate-50 to-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200/50">
            <TabsTrigger 
              value="menu" 
              className="flex-1 rounded-xl flex items-center justify-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">{t.menu}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="specials" 
              className="flex-1 rounded-xl flex items-center justify-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">{t.specials}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="drinks" 
              className="flex-1 rounded-xl flex items-center justify-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <Coffee className="w-4 h-4" />
              <span className="hidden sm:inline">{t.drinks}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 pb-24"
          >
            {filteredItems.map((item, index) => {
              const quantity = getItemQuantity(item.id);
              const itemName = language === 'en' ? item.name : item.nameJa;
              const itemDesc = language === 'en' ? item.description : item.descriptionJa;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#00C2A8]/10 transition-all duration-300">
                      <div className="flex gap-4 p-4">
                        {/* Image with badges and glow effect */}
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-50">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                          
                          {/* Badges overlay */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {item.isPopular && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                              >
                                <Badge className="bg-gradient-to-r from-[#FFD34E] to-[#FFC933] text-slate-900 border-0 text-xs px-2 py-0.5 shadow-md">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {language === 'en' ? 'Popular' : language === 'ja' ? '人気' : '热门'}
                                </Badge>
                              </motion.div>
                            )}
                            {item.isNew && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05 + 0.25, type: "spring" }}
                              >
                                <Badge className="bg-gradient-to-r from-[#00C2A8] to-[#00A890] text-white border-0 text-xs px-2 py-0.5 shadow-md">
                                  {language === 'en' ? 'New' : language === 'ja' ? '新作' : '新品'}
                                </Badge>
                              </motion.div>
                            )}
                            {item.isSpicy && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05 + 0.3, type: "spring" }}
                              >
                                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 text-xs px-2 py-0.5 shadow-md">
                                  <Flame className="w-3 h-3 mr-1" />
                                  {language === 'en' ? 'Spicy' : language === 'ja' ? '辛い' : '辣'}
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex-1">
                            {/* Title and rating */}
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-slate-900 truncate flex-1">
                                {itemName}
                              </h3>
                              {item.rating && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.05 + 0.15, type: "spring" }}
                                  className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2 py-0.5 rounded-full"
                                >
                                  <Star className="w-3.5 h-3.5 text-[#FFD34E] fill-[#FFD34E]" />
                                  <span className="text-xs text-slate-700">{item.rating}</span>
                                </motion.div>
                              )}
                            </div>
                            
                            {/* Description */}
                            {itemDesc && (
                              <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                                {itemDesc}
                              </p>
                            )}
                            
                            {/* Price with gradient */}
                            <p className="text-xl bg-gradient-to-r from-[#00C2A8] to-[#00A890] bg-clip-text text-transparent font-semibold">
                              ¥{item.price.toLocaleString()}
                            </p>
                          </div>
                          
                          {/* Add to cart controls with enhanced animations */}
                          <div className="mt-2">
                            <AnimatePresence mode="wait">
                              {quantity === 0 ? (
                                <motion.div
                                  key="add-button"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <Button
                                    onClick={() => addToCart(item)}
                                    size="sm"
                                    className="w-full h-9 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#00A890] hover:from-[#00A890] hover:to-[#008876] text-white active:scale-95 transition-all shadow-md hover:shadow-lg"
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    {language === 'en' ? 'Add' : language === 'ja' ? '追加' : '添加'}
                                  </Button>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="quantity-controls"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="flex items-center gap-2"
                                >
                                  <motion.div whileTap={{ scale: 0.9 }}>
                                    <Button
                                      onClick={() => removeFromCart(item.id)}
                                      size="sm"
                                      variant="outline"
                                      className="w-9 h-9 rounded-xl p-0 border-2 border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8]/10 active:scale-95 transition-all"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                  
                                  <motion.span 
                                    key={quantity}
                                    initial={{ scale: 1.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    className="flex-1 text-center text-slate-900 font-semibold text-lg"
                                  >
                                    {quantity}
                                  </motion.span>
                                  
                                  <motion.div whileTap={{ scale: 0.9 }}>
                                    <Button
                                      onClick={() => addToCart(item)}
                                      size="sm"
                                      className="w-9 h-9 rounded-xl p-0 bg-gradient-to-r from-[#00C2A8] to-[#00A890] hover:from-[#00A890] hover:to-[#008876] text-white active:scale-95 transition-all shadow-md"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Cart Button - Enhanced with gradient and animations */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute bottom-6 left-6 right-6 z-50"
        >
          <div className="flex gap-3">
            {/* Clear cart button with gradient border */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-lg hover:border-red-400 hover:bg-red-50 transition-all group"
            >
              <X className="w-5 h-5 text-slate-600 group-hover:text-red-500 transition-colors" />
            </motion.button>
            
            {/* View order button with gradient and glow */}
            <motion.div
              className="flex-1 relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00C2A8] to-[#00A890] opacity-50 blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <Button
                onClick={() => onViewOrder(cart)}
                className="relative w-full h-14 rounded-2xl bg-gradient-to-r from-[#00C2A8] via-[#00B69A] to-[#00A890] hover:from-[#00A890] hover:via-[#00A088] hover:to-[#008876] text-white shadow-2xl shadow-[#00C2A8]/40 transition-all flex items-center justify-between px-5 border-0"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium">{totalItems} {t.items}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs opacity-90">{t.total}</span>
                  <motion.span 
                    key={totalAmount}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-lg font-semibold"
                  >
                    ¥{totalAmount.toLocaleString()}
                  </motion.span>
                </div>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}