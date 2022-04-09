import { ethers, utils } from 'ethers'

export const isAddress = (address: string): boolean => {
  try {
    utils.getAddress(address)
  } catch (e) {
    return false
  }
  return true
}

export const isContract = async (
  provider: ethers.providers.Web3Provider,
  address: string
): Promise<boolean> => {
  const code = await provider.getCode(address)
  return code === '0x'
}
