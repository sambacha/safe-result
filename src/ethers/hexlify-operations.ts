// @fileName hexlify-operations
// @implements hexlifyTransaction
// @implements hexlifyUserOperation
//
// Convert an ethers.js transaction into a JSON-RPC transaction
//  - gasLimit => gas
//  - All values hexlified
//  - All numeric values zero-striped
//  - All addresses are lowercased
// @NOTE: This allows a TransactionRequest, but all values should be resolved
//       before this is called
// @TODO: This will likely be removed in future versions and prepareRequest
//        will be the preferred method for this.
  static hexlifyTransaction(
    transaction: TransactionRequest,
    allowExtra?: { [key: string]: boolean },
  ): { [key: string]: string | AccessList } {
    // Check only allowed properties are given
    const allowed = shallowCopy(allowedTransactionKeys);
    if (allowExtra) {
      for (const key in allowExtra) {
        if (allowExtra[key]) {
          allowed[key] = true;
        }
      }
    }

    checkProperties(transaction, allowed);

    const result: { [key: string]: string | AccessList } = {};

    // @note Some nodes do not like leading zeros (parity)
    [
      'gasLimit',
      'gasPrice',
      'type',
      'maxFeePerGas',
      'maxPriorityFeePerGas',
      'nonce',
      'value',
    ].forEach(function (key) {
      if ((<any>transaction)[key] == null) {
        return;
      }
      const value = hexValue((<any>transaction)[key]);
      if (key === 'gasLimit') {
        key = 'gas';
      }
      result[key] = value;
    });

    ['from', 'to', 'data'].forEach(function (key) {
      if ((<any>transaction)[key] == null) {
        return;
      }
      result[key] = hexlify((<any>transaction)[key]);
    });

    if ((<any>transaction).accessList) {
      result['accessList'] = accessListify((<any>transaction).accessList);
    }

    return result;
  }

  // Convert an ethers.js UserOp into a JSON-RPC compatible UserOperation
  //  - All values hexlified
  //  - All numeric values zero-striped
  //  - All addresses are lowercased
  static hexlifyUserOperation(
    transaction: TransactionRequest,
    allowExtra?: { [key: string]: boolean },
  ): { [key: string]: string | AccessList } {
    // Check only allowed properties are given
    const allowed = shallowCopy(allowedTransactionKeys);
    if (allowExtra) {
      for (const key in allowExtra) {
        if (allowExtra[key]) {
          allowed[key] = true;
        }
      }
    }

    // checkProperties(transaction, allowed);

    const result: { [key: string]: string | AccessList } = {};

    // Some nodes (INFURA ropsten; INFURA mainnet is fine) do not like leading zeros.
    [
      'callGas',
      'verificationGas',
      'preVerificationGaspe',
      'maxFeePerGas',
      'maxPriorityFeePerGas',
      'nonce',
      'initCode',
      'callData',
      'paymasterData',
      'signature',
    ].forEach(function (key) {
      if ((<any>transaction)[key] == null) {
        return;
      }
      const value = hexValue((<any>transaction)[key]);
      result[key] = value;
    });

    ['sender', 'paymaster'].forEach(function (key) {
      if ((<any>transaction)[key] == null) {
        return;
      }
      result[key] = hexlify((<any>transaction)[key]);
    });

    if ((<any>transaction).accessList) {
      result['accessList'] = accessListify((<any>transaction).accessList);
    }

    return result;
  }
}
