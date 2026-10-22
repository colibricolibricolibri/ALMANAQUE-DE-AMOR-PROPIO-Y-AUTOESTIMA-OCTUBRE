/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_CLIENT_ID?: string;
  readonly VITE_MERCADOPAGO_PUBLIC_KEY?: string;
  readonly VITE_DEFAULT_ARS_EXCHANGE_RATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
