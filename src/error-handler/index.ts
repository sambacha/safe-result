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

export enum ProviderRpcErrorCode {
  ACCOUNT_ACCESS_ALREADY_REQUESTED = -32002,
  DOES_NOT_EXIST                   = -32601,
  INVALID_PARAMS                   = -32602,
  ACCOUNT_ACCESS_REJECTED          = 4001,
  UNAUTHORIZED                     = 4100,
  UNSUPPORTED_METHOD               = 4200,
  DISCONNECTED                     = 4900,
  CHAIN_DISCONNECTED               = 4901,
  CHAIN_NOT_ADDED                  = 4902,
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
    console.assert(false, 'ErrorHandler %s work', 'didn\'t');
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
}
