export interface MenuItem {
  id: string;
  name: string;
  nameJa: string;
  price: number;
  image: string;
  category: 'menu' | 'specials' | 'drinks';
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type Currency = 'USDC' | 'JPYC';
export type Network = 'Base' | 'Arbitrum' | 'Solana' | 'Ethereum' | 'Polygon' | 'Avalanche';
export type PaymentChannel = 'binance' | 'walletconnect' | 'metamask' | 'onchain';
export type PaymentType = 'crypto' | 'yen';
export type YenPaymentMethod = 'applepay' | 'paypay' | 'rakutenpay' | 'card';
