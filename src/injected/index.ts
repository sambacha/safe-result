// Originally from WAGMI Library
// Removed uneeded functionality
// thanks to @tmm

type InjectedProviderFlags = {
    isBraveWallet?: true
    isCoinbaseWallet?: true
    isFrame?: true
    isMetaMask?: true
    isOpera?: true
    isTally?: true
    isTokenary?: true
    isTrust?: true
  }
  type InjectedProviders = InjectedProviderFlags & {
    isMetaMask: true
    /** Only exists in MetaMask as of 2022/04/03 */
    _events: {
      connect?: () => void
    }
    /** Only exists in MetaMask as of 2022/04/03 */
    _state?: {
      accounts?: string[]
      initialized?: boolean
      isConnected?: boolean
      isPermanentlyDisconnected?: boolean
      isUnlocked?: boolean
    }
  }



interface Ethereum extends InjectedProviders {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  providers?: Ethereum[];

  // RPC Request API Methods
  // https://docs.metamask.io/guide/rpc-api.html
  request(args: { method: "eth_accounts" }): Promise<string[]>;
  request(args: { method: "eth_chainId" }): Promise<string>;
  request(args: { method: "eth_requestAccounts" }): Promise<string[]>;
  request(args: { method: "personal_sign"; params: [string, string] }): Promise<string>;
  request(args: { method: "wallet_addEthereumChain"; params: AddEthereumChainParameter[] }): Promise<null>;
  request(args: { method: "wallet_switchEthereumChain"; params: [{ chainId: string }] }): Promise<null>;
  request(args: { method: "wallet_watchAsset"; params: WatchAssetParams }): Promise<boolean>;
  request(args: { method: "web3_clientVersion" }): Promise<string>;
}


  interface Window {
    ethereum?: Ethereum
  }
  interface ProviderRpcError extends Error {
    code: 4001 | 4902
    data?: unknown
    message: string
  }
}
