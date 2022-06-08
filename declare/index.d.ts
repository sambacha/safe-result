/** @interface EthereumProvider */
export interface EthereumProvider {
  on?: (...args: any[]) => void
  removeListener?: (...args: any[]) => void
  autoRefreshOnNetworkChange?: boolean
}

// declare global {
//  interface Window {
//    ethereum?: EthereumProvider
//  }
//}

declare global {
  interface Window {
    ENV: any;
    ethereum?: {
      send: unknown;
      isMetaMask?: true;
      isCoinBase?: true,
      isTally?: true,
      enable: () => Promise<string[]>;
      on?: (...args: any[]) => void;
      removeListener?: (...args: any[]) => void;
      autoRefreshOnNetworkChange?: boolean;
    };
    web3?: Record<string, unknown>;
  }
}
