/**
* @fileName Error Handler
* @source https://github.com/Zoltu/ethereum-browser-sdk
*/

// @const genericResultError
export const genericResultError = hideStackFrames(function genericResultError(message, errorProperties) {
  // eslint-disable-next-line no-restricted-syntax
  const err = new Error(message);
  ObjectAssign(err, errorProperties);
  return err;
});

// @class ErrorHandler
export class ErrorHandler {
	// TODO: surface the error in the UI somewhere, perhaps an error toast
	public readonly noticeError = (error: any) => {
		if (error instanceof Error) {
			console.error(error)
		} else if (typeof error === 'string') {
			console.error(error)
		} else {
			console.error(error)
		}
	}

	public readonly asyncWrapper = <R, P extends any[]>(asyncFunction: (...args: P) => Promise<R>): (...args: P) => void => {
		return (...args: P) => asyncFunction(...args).catch(this.noticeError)
	}
}

// @class JsonRpcError
export class JsonRpcError extends Error {
	constructor(public readonly code: number, message: string, public readonly data?: object) {
		super(message)
		this.name = this.constructor.name
	}
}
