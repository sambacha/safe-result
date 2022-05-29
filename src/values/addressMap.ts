/** 
* @module Address Map
* @see {@link TODO}
* @summary Address map so that DApp network <-> ChainId param will be in sync, 
*  so if user changes the network by changing the URL but the request fails,
*  revert the URL back to current chainId
*/

import { SupportedChainId } from './ChainId';

const DEFAULT_NETWORKS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
]

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: SupportedChainId[] = []
): { [chainId: number]: T } {
  return DEFAULT_NETWORKS.concat(additionalNetworks).reduce<{ [chainId: number]: T }>((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
  
type AddressMap = { [chainId: number]: string }

export const UNI_ADDRESS:       AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')
export const V2_ROUTER_ADDRESS: AddressMap = constructSameAddressMap('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D')
export const V3_ROUTER_ADDRESS: AddressMap = constructSameAddressMap('0xE592427A0AEce92De3Edee1F18E0157C05861564')
