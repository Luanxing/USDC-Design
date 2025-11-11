export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_MERCHANT_WALLET_ADDRESS?: `0x${string}`;
    readonly VITE_POLYGON_USDC_CONTRACT?: `0x${string}`;
    readonly VITE_POLYGON_TESTNET_RPC?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

