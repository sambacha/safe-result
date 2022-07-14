/**
 * Subsystem for building JSON Rpc Providers.
 *
 * @remarks
 * The `error-handler` defines the {@link ProviderRpcErrorCode} enum and {@link ErrorHandler} class,
 * which are used to build JSON Rpc Providers.
 *
 * @packageDocumentation
 */


import * as console from 'node:console';

interface ErrorConstructor<T extends any[]> {
  new (...args: T): Error;
}

export function ensure<T extends any[]>(condition: boolean, ErrorToThrow: ErrorConstructor<T>, ...errorArgs: T):
  asserts condition {
  if (!condition) {
    throw new ErrorToThrow(...errorArgs);
  }
}

/**
* @export
* @interface ErrorCodes
*
*/

interface ProviderRpcErrorCode {
  readonly rpc: {
    readonly invalidInput       : -32_000;
    readonly resourceNotFound   : -32_001;
    readonly resourceUnavailable: -32_002; // ACCOUNT_ACCESS_ALREADY_REQUESTED
    readonly transactionRejected: -32_003;
    readonly methodNotSupported : -32_004;
    readonly limitExceeded      : -32_005;
    readonly parse              : -32_700;
    readonly invalidRequest     : -32_600;
    readonly methodNotFound     : -32_601;
    readonly invalidParams      : -32_602; // DOES_NOT_EXIST
    readonly internal           : -32_603;
  };
  readonly provider: {
    readonly userRejectedRequest: 4001;
    readonly unauthorized       : 4100;
    readonly unsupportedMethod  : 4200;
    readonly disconnected       : 4900;
    readonly chainDisconnected  : 4901;
  };
}

// ErrorCodes
export const errorCodes: ProviderRpcErrorCode = {
  rpc: {
    invalidInput       : -32_000,
    resourceNotFound   : -32_001,
    resourceUnavailable: -32_002,
    transactionRejected: -32_003,
    methodNotSupported : -32_004,
    limitExceeded      : -32_005,   // LIMIT_EXCEEDED
    parse              : -32_700,
    invalidRequest     : -32_600,
    methodNotFound     : -32_601,   // METHOD_NOTFOUND
    invalidParams      : -32_602,   // INVALID_PARAMS
    internal           : -32_603,   // INTERNAL
  },
  provider: {
    userRejectedRequest: 4001,   // USER_REJECTEDREQUEST
    unauthorized       : 4100,   // UNAUTHORIZED
    unsupportedMethod  : 4200,   // UNSUPPORTEDMETHOD
    disconnected       : 4900,
    chainDisconnected  : 4901,
  },
};

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-234.md

export const errorValues = {
  '-32700': {
    'PARSE_ERROR': {
    standard: 'JSON RPC 2.0',
    message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
  },
},
  '-32600': {
    'INVALID_REQUEST': {
    standard: 'JSON RPC 2.0',
    message: 'The JSON sent is not a valid Request object.',
    },
  },
  '-32601': {
    'METHOD_NOT_FOUND': {
    standard: 'JSON RPC 2.0',
    message: 'The method does not exist / is not available.',
    },
  },
  '-32602': {
    'INVALID_PARAMS': {
    standard: 'JSON RPC 2.0',
    message: 'Invalid method parameter(s).',
    },
  },
  '-32603': {
    'INTERNAL_ERROR': {
    standard: 'JSON RPC 2.0',
    message: 'Internal JSON-RPC error.',
    },
  },
  // eth_getStorageAt [ "0x<address>", { "blockHash": "0x<non-canonical-block-hash>", "requireCanonical": true } -> raise block-not-canonical error
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1474.md#:~:text=If%20the%20block%20is%20not%20found,found%20rather%20than%20block%2Dnot%2Dcanonical.
  '-32000': {
    'SERVER_ERROR': {
    standard: 'EIP-1474, EIP-1898',
    message: '🔴 Server error: Invalid input, unable to locate canonical block',
    },
  },
  // eth_getStorageAt [ "0x<address>", { "blockHash": "0x<non-existent-block-hash>" } -> raise block-not-found error
  // eth_getStorageAt [ "0x<address>", { "blockHash": "0x<non-existent-block-hash>", "requireCanonical": false } -> raise block-not-found error
  // eth_getStorageAt [ "0x<address>", { "blockHash": "0x<non-existent-block-hash>", "requireCanonical": true } -> raise block-not-found error
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1474.md#:~:text=If%20the%20block%20is%20not%20found,found%20rather%20than%20block%2Dnot%2Dcanonical.
  '-32001': {
    standard: 'EIP-1474, EIP-1898',
    message: '🔴 Server error: Requested resource, block,  not found.',
  },
  '-32002': {
    standard: 'EIP-1474',
    message: '🔴 Resource unavailable.',
  },
  '-32003': {
    standard: 'EIP-1474',
    message: '🔴 Transaction rejected.',
  },
  '-32004': {
    standard: 'EIP-1474',
    message: '🔴 Method not supported.',
  },
  '-32005': {
    standard: 'EIP-1474',
    message: '🔻 Request limit exceeded.',
  },
  '4001': {
    standard: 'EIP-1193',
    message: '🔻 User rejected the request.',
  },
  '4100': {
    "UNAUTHORIZED": {
    standard: 'EIP-1193',
    message: '🔻 The requested account and/or method has not been authorized by the user.',
  },
},
  '4200': {
    "UNSUPPORTED_METHOD": {
    standard: 'EIP-1193',
    message: '🔻 The requested method is not supported by this Ethereum provider.',
  },
},
  '4900': {
    "DISCONNECTED":{
    standard: 'EIP-1193',
    message: '🔺 The provider is disconnected from all chains.',
  },
},
  '4901': {
    "CHAIN_DISCONNECTED": {
    standard: 'EIP-1193',
    message: '🔺 The provider is disconnected from the specified chain.',
    },
  }
}

/**
 * 
 * @public
 * @class ErrorHandler
 */
export class ErrorHandler {
	// NOTE: surface the error in the UI somewhere, perhaps an error toast
	public readonly noticeError = (error: any) => {
		if (error instanceof Error) {
			console.error(error)
		} else {
    console.error(error)
    console.assert(false, '🔺 SafeErrorHandler %s work', 'didn\'t');
    }
	}

	public readonly asyncWrapper = <R, P extends any[]>(asyncFunction: (...args: P) => Promise<R>): (...args: P) => void => {
		return (...args: P) => asyncFunction(...args).catch(this.noticeError)
	}
}


/**
 *
 * @public
 * @class JsonRpcError
 * @extends {Error}
 */
export class JsonRpcError extends Error {
	constructor(public readonly code: number, message: string, public readonly data?: object) {
		super(message)
		this.name = this.constructor.name
	}
}

/**
 *
 *
 * @public
 * @class ProviderRpcError
 * @extends {Error}
 */
export class ProviderRpcError extends Error {
  message: string
  code: ProviderRpcErrorCode | number
  data?: unknown

/**
 * 
 * Creates an instance of ProviderRpcError.
 * @param {(Pick<ProviderRpcError, 'message' | 'code' | 'data'>)} error
 * @memberof ProviderRpcError
 */
constructor(error: Pick<ProviderRpcError, 'message' | 'code' | 'data'>) {
    super(error.message)
    this.message = error.message
    this.code = error.code
    this.data = error.data
  }
};
