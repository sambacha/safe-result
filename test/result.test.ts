import { getAddress } from '@ethersproject/address';
import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { BlockTag, FeeData, Provider, TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";

import { Deferrable, defineReadOnly, resolveProperties, shallowCopy } from "@ethersproject/properties";
import {
    Signer, VoidSigner,
    // Types
    ExternallyOwnedAccount
} from "@ethersproject/abstract-signer";

getAddress(): Promise<string> {
    return Promise.resolve(this.address);
}

const tx = shallowCopy(transaction);

if (tx.from == null) {
    tx.from = this.getAddress();

} else {
    // Make sure any provided address matches this signer
    tx.from = Promise.all([
        Promise.resolve(tx.from),
        this.getAddress()
    ]).then((result) => {
        if (result[0].toLowerCase() !== result[1].toLowerCase()) {
            logger.throwArgumentError("from address mismatch", "transaction", transaction);
        }
        return result[0];
    });
}

// warns if addresses are not checksummed
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address);
    warning(address === checksummedAddress, `${address} is not checksummed.`);
    return checksummedAddress;
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}


export function validateAndParseAddress(address: string): string {
    try {
      const checksummedAddress = getFromAddress(address);
      warning(address === checksummedAddress, `${address} is not checksummed.`);
      return checksummedAddress;
    } catch (error) {
      invariant(false, `${address} is not a valid address.`);
    }
  }
  
  

export const isSameAddress = (addressOne?: TAddress, addressTwo?: TAddress) =>
  isSameString(addressOne, addressTwo);



  export function isNotWeth9Address(address: string): string {
    try {
      const weth9Address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
      warning(address === weth9Address, `${address} is the weth9 contract address.`);
      return weth9Address;
    } catch (error) {
      invariant(false, `${address} is not a valid address.`);
    }
  }


  

export function isNotNullAddress(address: string): string {
    try {
      const nullAddress = '0x0000000000000000000000000000000000000000'
      warning(address === nullAddress, `${address} is the null address.`);
      return nullAddress;
    } catch (error) {
      invariant(false, `${address} is not a valid address.`);
    }
  }
  