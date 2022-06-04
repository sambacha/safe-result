/**
* @fileName Error Handler
* @source https://github.com/Zoltu/ethereum-browser-sdk
*/

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

// @class ErrorWithData
export class ErrorWithData extends Error {
	public constructor(message: string, public readonly data: unknown, public readonly code: number) {
		super(message)
		Object.setPrototypeOf(this, ErrorWithData.prototype)
	}
}

// @export errorExtractor
export function errorExtractor(maybe: unknown): { message: string, data: unknown, code: number } {
	if (maybe instanceof ErrorWithData) {
		return maybe
	}
	if (maybe instanceof Error) {
		const message = maybe.message
		const data = 'data' in maybe ? (maybe as {data:unknown}).data : JSON.stringify(maybe)
		const code = 'code' in maybe
			? typeof (maybe as {code:unknown}).code === 'number'
				? (maybe as {code:number}).code
				: typeof (maybe as {code:unknown}).code === 'string'
					? Number.parseInt((maybe as {code:string}).code)
					: 0
			: 0
		return { message, data, code }
	} else {
		return { message: 'Unknown error occurred.', data: JSON.stringify(maybe), code: 0 }
	}
}
