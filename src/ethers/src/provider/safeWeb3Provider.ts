/**
* @fileName safeWeb3Provider
* @version 0.1.0
* @since v0.0.0
*/

import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { ChainID, getChainMetadata } from "./networks";

export const alchemyURL = `https://api.sushirelay.com/v1`;
export const providerURL = `http://127.0.0.1:8545/`;

/**
* @export safeWeb3Provider
* @summary Default chain is mainnet. Used for SSR or for when theres no wallet in the browser.
* 
*/
export function safeWeb3Provider(

  chainId = 1,
  /**
   *  @dev If true this is being used by vaults, in which case we only need a JsonRpc provider
   *  thats because this app only reads opportunities from vaults and routes the user to the old
   *  interface if they want to interact with vaults.
   */
  vaults?: boolean
): JsonRpcProvider | Web3Provider {

  let providerURL = getChainMetadata(chainId).rpcUrl ?? "";

  const isClient = typeof window === "object";
  if (!isClient || vaults) {
    return new JsonRpcProvider(providerURL);
  }

  if (window.ethereum) {
    // @ts-ignore
    return new Web3Provider(window.ethereum)
  } else {
    return new JsonRpcProvider(providerURL);
  }

};
