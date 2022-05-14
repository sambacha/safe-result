// TODO
/**
 * Applies the L1 => L2 aliasing scheme to an address.
 *
 * @param address Address to apply the scheme to.
 * @returns Address with the scheme applied.
 */
export const applyL1ToL2Alias = (address: string): string => {
  if (!ethers.utils.isAddress(address)) {
    throw new Error(`not a valid address: ${address}`)
  }

  return bnToAddress(ethers.BigNumber.from(address).add(L1_TO_L2_ALIAS_OFFSET))
}

/**
 * Reverses the L1 => L2 aliasing scheme from an address.
 *
 * @param address Address to reverse the scheme from.
 * @returns Alias with the scheme reversed.
 */
export const undoL1ToL2Alias = (address: string): string => {
  if (!ethers.utils.isAddress(address)) {
    throw new Error(`not a valid address: ${address}`)
  }

  return bnToAddress(ethers.BigNumber.from(address).sub(L1_TO_L2_ALIAS_OFFSET))
}
