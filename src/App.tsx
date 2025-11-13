import { useState } from 'react';
import { useMemo } from 'react';
import { Menu } from './components/Menu';
import { OrderReview } from './components/OrderReview';
import { PaymentHub } from './components/PaymentHub';
import { ExchangePay } from './components/ExchangePay';
import { WalletConnect } from './components/WalletConnect';
import { ApplePay } from './components/ApplePay';
import { PayPay } from './components/PayPay';
import { RakutenPay } from './components/RakutenPay';
import { CreditCard } from './components/CreditCard';
import { Processing } from './components/Processing';
import { Success } from './components/Success';
import { Failed } from './components/Failed';
import { LanguageSheet } from './components/LanguageSheet';
import type { CartItem, Currency, Network, PaymentChannel, YenPaymentMethod } from './types/order';
import { CheckoutDemo } from './components/CheckoutDemo';

export type Screen = 
  | 'menu'
  | 'order-review'
  | 'payment-hub'
  | 'exchange-pay'
  | 'wallet-connect'
  | 'apple-pay'
  | 'paypay'
  | 'rakuten-pay'
  | 'credit-card'
  | 'processing'
  | 'success'
  | 'failed';

export type ExchangeName = 'Binance' | 'OKX' | 'Bybit' | 'Coinbase';

export default function App() {
  const isStandaloneCheckout = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const path = window.location.pathname.toLowerCase();
    return path.startsWith('/checkout') || path.startsWith('/demo-checkout');
  }, []);

  if (isStandaloneCheckout) {
    return <CheckoutDemo />;
  }

  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [language, setLanguage] = useState<'en' | 'ja' | 'zh'>('en');
  const [displayCurrency, setDisplayCurrency] = useState<'JPY' | 'USD'>('JPY');
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  
  // Order state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Crypto payment state
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(undefined);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState<PaymentChannel | undefined>(undefined);
  const [selectedExchange, setSelectedExchange] = useState<ExchangeName | undefined>(undefined);
  
  // Yen payment state
  const [selectedYenMethod, setSelectedYenMethod] = useState<YenPaymentMethod | undefined>(undefined);

  // Exchange merchant IDs
  const merchantIds = {
    Binance: '392847561',
    OKX: '845926137',
    Bybit: '721593846',
    Coinbase: '638274951'
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleViewOrder = (orderCart: CartItem[]) => {
    setCart(orderCart);
    navigateTo('order-review');
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCart(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const handleCryptoPayment = (currency: Currency, channel: PaymentChannel, network?: Network, exchange?: ExchangeName) => {
    setSelectedCurrency(currency);
    setSelectedPaymentChannel(channel);
    if (network) {
      setSelectedNetwork(network);
    }
    if (exchange) {
      setSelectedExchange(exchange);
    }
    
    // Clear yen payment state
    setSelectedYenMethod(undefined);
    
    if (channel === 'binance') {
      navigateTo('exchange-pay');
    } else if (currency === 'JPYC') {
      // JPYC: Skip wallet-connect screen, go directly to processing
      navigateTo('processing');
    } else {
      // USDC: WalletConnect or MetaMask - show wallet-connect screen
      navigateTo('wallet-connect');
    }
  };

  const handleYenPayment = (method: YenPaymentMethod) => {
    setSelectedYenMethod(method);
    
    // Clear crypto payment state
    setSelectedCurrency(undefined);
    setSelectedPaymentChannel(undefined);
    setSelectedNetwork(undefined);
    
    switch (method) {
      case 'applepay':
        navigateTo('apple-pay');
        break;
      case 'paypay':
        navigateTo('paypay');
        break;
      case 'rakutenpay':
        navigateTo('rakuten-pay');
        break;
      case 'card':
        navigateTo('credit-card');
        break;
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Main Screen Container */}
      <div className="w-full min-h-screen relative">
        {currentScreen === 'menu' && (
          <Menu
            onViewOrder={handleViewOrder}
            onOpenLanguage={() => setShowLanguageSheet(true)}
            language={language}
          />
        )}
        
        {currentScreen === 'order-review' && (
          <OrderReview
            cart={cart}
            onBack={() => navigateTo('menu')}
            onCheckout={() => navigateTo('payment-hub')}
            onUpdateQuantity={handleUpdateQuantity}
            language={language}
          />
        )}

        {currentScreen === 'payment-hub' && (
          <PaymentHub
            onBack={() => navigateTo('order-review')}
            onCryptoPayment={handleCryptoPayment}
            onYenPayment={handleYenPayment}
            language={language}
            totalAmount={totalAmount}
          />
        )}

        {currentScreen === 'exchange-pay' && selectedExchange && (
          <ExchangePay
            exchangeName={selectedExchange}
            merchantId={merchantIds[selectedExchange]}
            onSuccess={() => navigateTo('success')}
            onBack={() => navigateTo('payment-hub')}
            language={language}
            totalAmount={totalAmount}
            cart={cart}
          />
        )}

        {currentScreen === 'wallet-connect' && selectedCurrency && selectedNetwork && (
          <WalletConnect
            onConfirm={() => navigateTo('processing')}
            onBack={() => navigateTo('payment-hub')}
            language={language}
            currency={selectedCurrency}
            network={selectedNetwork}
            totalAmount={totalAmount}
          />
        )}

        {currentScreen === 'apple-pay' && (
          <ApplePay
            onSuccess={() => navigateTo('processing')}
            onBack={() => navigateTo('payment-hub')}
            language={language}
            totalAmount={totalAmount}
          />
        )}

        {currentScreen === 'paypay' && (
          <PayPay
            onSuccess={() => navigateTo('processing')}
            onBack={() => navigateTo('payment-hub')}
            language={language}
          />
        )}

        {currentScreen === 'rakuten-pay' && (
          <RakutenPay
            onSuccess={() => navigateTo('processing')}
            onBack={() => navigateTo('payment-hub')}
            language={language}
          />
        )}

        {currentScreen === 'credit-card' && (
          <CreditCard
            onSuccess={() => navigateTo('processing')}
            onBack={() => navigateTo('payment-hub')}
            language={language}
            totalAmount={totalAmount}
          />
        )}

        {currentScreen === 'processing' && (
          <Processing
            onSuccess={() => navigateTo('success')}
            onFailed={() => navigateTo('failed')}
            language={language}
            currency={selectedCurrency}
            network={selectedNetwork}
            yenMethod={selectedYenMethod}
          />
        )}

        {currentScreen === 'success' && (
          <Success
            language={language}
            onNewPayment={() => {
              setCart([]);
              setSelectedCurrency(undefined);
              setSelectedPaymentChannel(undefined);
              setSelectedNetwork(undefined);
              setSelectedYenMethod(undefined);
              navigateTo('menu');
            }}
            currency={selectedCurrency}
            paymentChannel={selectedPaymentChannel}
            yenMethod={selectedYenMethod}
            totalAmount={totalAmount}
            cartItems={cart}
          />
        )}

        {currentScreen === 'failed' && (
          <Failed
            onRetry={() => navigateTo('payment-hub')}
            onSwitchMethod={() => navigateTo('payment-hub')}
            language={language}
          />
        )}

        <LanguageSheet
          isOpen={showLanguageSheet}
          onClose={() => setShowLanguageSheet(false)}
          language={language}
          setLanguage={setLanguage}
          displayCurrency={displayCurrency}
          setDisplayCurrency={setDisplayCurrency}
        />
      </div>
    </div>
  );
}