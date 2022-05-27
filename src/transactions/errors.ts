/**
 * @module ErrorHandling
 * @summary EthersJs ErrorCodes + Revert Parsing
 * @see {@link TODO}
 */
import { Provider, TransactionReceipt } from "@ethersproject/providers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { toUtf8String } from "ethers/lib/utils"

//export type TransactionReceipt {
//}

export type ErrorSignature = {
    r: string;
    s: string;
    yParity: 0 | 1;
    networkV: bigint;
};

export type ErrorAccessList = Array<{ address: string, storageKeys: Array<string> }>;

export interface ErrorTransaction {
    type?: number;
    to?: string;
    from?: string;
    nonce?: number;
    gasLimit?: bigint;
    gasPrice?: bigint;
    maxPriorityFeePerGas?: bigint;
    maxFeePerGas?: bigint;
    data?: string;
    value?: bigint;
    chainId?: bigint;
    hash?: string;
    signature?: ErrorSignature;
    accessList?: ErrorAccessList;
}

export interface ErrorFetchRequestWithBody extends ErrorFetchRequest {
    body: Readonly<Uint8Array>;
}

export interface ErrorFetchRequest {
    url: string;
    method: string;
    headers: Readonly<Record<string, string>>;
    getHeader(key: string): string;
    body: null | Readonly<Uint8Array>;
    hasBody(): this is ErrorFetchRequestWithBody;
}


export interface ErrorFetchResponseWithBody extends ErrorFetchResponse {
    body: Readonly<Uint8Array>;
}

export interface ErrorFetchResponse {
    statusCode: number;
    statusMessage: string;
    headers: Readonly<Record<string, string>>;
    getHeader(key: string): string;
    body: null | Readonly<Uint8Array>;
    hasBody(): this is ErrorFetchResponseWithBody;
}

/**
 * @export ErrorCode
 * @summary EthersJs ErrorCode
 */
export type ErrorCode =

    // Generic Errors
    "UNKNOWN_ERROR" | "NOT_IMPLEMENTED" | "UNSUPPORTED_OPERATION" |
    "NETWORK_ERROR" | "SERVER_ERROR" | "TIMEOUT" | "BAD_DATA" |

    // Operational Errors
    "BUFFER_OVERRUN" |  "NUMERIC_FAULT" |

    // Argument Errors
    "INVALID_ARGUMENT" | "MISSING_ARGUMENT" | "UNEXPECTED_ARGUMENT" |
    "VALUE_MISMATCH" |

    // Blockchain Errors
    "CALL_EXCEPTION" | "INSUFFICIENT_FUNDS" | "NONCE_EXPIRED" |
    "REPLACEMENT_UNDERPRICED" | "TRANSACTION_REPLACED" |
    "UNPREDICTABLE_GAS_LIMIT" |
    "UNCONFIGURED_NAME" | "OFFCHAIN_FAULT"
;

export interface EthersError<T extends ErrorCode = ErrorCode> extends Error {
    code: ErrorCode;
//    recover?: (...args: Array<any>) => any;
    info?: Record<string, any>;
    error?: Error;
}

// @note Generic Errors

export interface UnknownError extends EthersError<"UNKNOWN_ERROR"> {
    [ key: string ]: any;
}

export interface NotImplementedError extends EthersError<"NOT_IMPLEMENTED"> {
    operation: string;
}

export interface UnsupportedOperationError extends EthersError<"UNSUPPORTED_OPERATION"> {
    operation: string;
}

export interface NetworkError extends EthersError<"NETWORK_ERROR"> {
    event: string;
}

export interface ServerError extends EthersError<"SERVER_ERROR"> {
    request: ErrorFetchRequest | string;
    response?: ErrorFetchResponse;
}

export interface TimeoutError extends EthersError<"TIMEOUT"> {
    operation: string;
    reason: string;
    request?: ErrorFetchRequest;
}

export interface BadDataError extends EthersError<"BAD_DATA"> {
    value: any;
}


// @note Operational Errors

export interface BufferOverrunError extends EthersError<"BUFFER_OVERRUN"> {
    buffer: Uint8Array;
    length: number;
    offset: number;
}

export interface NumericFaultError extends EthersError<"NUMERIC_FAULT"> {
    operation: string;
    fault: string;
    value: any;
}


// Argument Errors

export interface InvalidArgumentError extends EthersError<"INVALID_ARGUMENT"> {
    argument: string;
    value: any;
    info?: Record<string, any>
}

export interface MissingArgumentError extends EthersError<"MISSING_ARGUMENT"> {
    count: number;
    expectedCount: number;
}

export interface UnexpectedArgumentError extends EthersError<"UNEXPECTED_ARGUMENT"> {
    count: number;
    expectedCount: number;
}

//export interface ValueMismatchError extends EthersError<ErrorCode.UNEXPECTED_ARGUMENT> {
//    count: number;
//    expectedCount: number;
//}


// Blockchain Errors

export interface CallExceptionError extends EthersError<"CALL_EXCEPTION"> {
    // The revert data
    data: string;

    // The transaction that triggered the exception
    transaction?: any;

    // The Contract, method and args used during invocation
    method?: string;
    signature?: string;
    args?: ReadonlyArray<any>;

    // The Solidity custom revert error
    errorSignature?: string;
    errorName?: string;
    errorArgs?: ReadonlyArray<any>;
    reason?: string;
}

//export interface ContractCallExceptionError extends CallExceptionError {
    // The transaction call
//    transaction: any;//ErrorTransaction;
//}

export interface InsufficientFundsError extends EthersError<"INSUFFICIENT_FUNDS"> {
    transaction: any;//ErrorTransaction;
}

export interface NonceExpiredError extends EthersError<"NONCE_EXPIRED"> {
    transaction: any; //ErrorTransaction;
}

export interface OffchainFaultError extends EthersError<"OFFCHAIN_FAULT"> {
    transaction?: any;
    reason: string;
}

export interface ReplacementUnderpricedError extends EthersError<"REPLACEMENT_UNDERPRICED"> {
    transaction: any; //ErrorTransaction;
}

export interface TransactionReplacedError extends EthersError<"TRANSACTION_REPLACED"> {
    cancelled: boolean;
    reason: "repriced" | "cancelled" | "replaced";
    hash: string;
    replacement: any; //TransactionResponse;
    receipt: any; //TransactionReceipt;
}

export interface UnconfiguredNameError extends EthersError<"UNCONFIGURED_NAME"> {
    value: string;
}

export interface UnpredictableGasLimitError extends EthersError<"UNPREDICTABLE_GAS_LIMIT"> {
    transaction: any; //ErrorTransaction;
}


// Coding; converts an ErrorCode its Typed Error
/**
 * @export CodedEthersError
 */
export type CodedEthersError<T> =
    T extends "UNKNOWN_ERROR" ? UnknownError:
    T extends "NOT_IMPLEMENTED" ? NotImplementedError:
    T extends "UNSUPPORTED_OPERATION" ? UnsupportedOperationError:
    T extends "NETWORK_ERROR" ? NetworkError:
    T extends "SERVER_ERROR" ? ServerError:
    T extends "TIMEOUT" ? TimeoutError:
    T extends "BAD_DATA" ? BadDataError:

    T extends "BUFFER_OVERRUN" ? BufferOverrunError:
    T extends "NUMERIC_FAULT" ? NumericFaultError:

    T extends "INVALID_ARGUMENT" ? InvalidArgumentError:
    T extends "MISSING_ARGUMENT" ? MissingArgumentError:
    T extends "UNEXPECTED_ARGUMENT" ? UnexpectedArgumentError:

    T extends "CALL_EXCEPTION" ? CallExceptionError:
    T extends "INSUFFICIENT_FUNDS" ? InsufficientFundsError:
    T extends "NONCE_EXPIRED" ? NonceExpiredError:
    T extends "OFFCHAIN_FAULT" ? OffchainFaultError:
    T extends "REPLACEMENT_UNDERPRICED" ? ReplacementUnderpricedError:
    T extends "TRANSACTION_REPLACED" ? TransactionReplacedError:
    T extends "UNCONFIGURED_NAME" ? UnconfiguredNameError:
    T extends "UNPREDICTABLE_GAS_LIMIT" ? UnpredictableGasLimitError:

    never;

/**
 * #isError
 * @param error 
 * @param code 
 * @returns 
 */
export function isError<K extends ErrorCode, T extends CodedEthersError<K>>(error: any, code: K): error is T {
    return (error && (<EthersError>error).code === code);
}

/**
 * #isCallException
 * @param error 
 * @returns 
 */
export function isCallException(error: any): error is CallExceptionError {
    return isError(error, "CALL_EXCEPTION");
}

/**
 * #getTransactionError
 * @param tx 
 * @param receipt 
 * @param provider 
 * @returns 
 */
export const getTransactionError = async (
    tx: TransactionResponse,
    receipt: TransactionReceipt,
    provider: Provider
): Promise<string> => {
    if (typeof tx !== "object") {
        throw TypeError(`tx argument ${tx} must be a transaction object`)
    }
    if (typeof receipt !== "object") {
        throw TypeError(
            `receipt argument ${receipt} must be a transaction receipt object`
        )
    }
    if (receipt.status) {
        throw TypeError(
            "Transaction did not fail. Can only read the revert reason from failed transactions"
        )
    }
    if (!receipt.transactionHash) {
        throw TypeError(`There is no transaction hash on the receipt object`)
    }
    if (receipt.gasUsed === tx.gasLimit) {
        throw Error("Transaction failed as it ran out of gas.")
    }

    let rawMessageData
    try {
        const result = await provider.call(
            {
                ...tx,
            },
            receipt.blockNumber
        )

        // Trim the 0x prefix
        rawMessageData = result.slice(2)
    } catch (e) {
        if (e.message.startsWith("Node error: ")) {
            // Trim "Node error: "
            const errorObjectStr = e.message.slice(12)
            // Parse the error object
            const errorObject = JSON.parse(errorObjectStr)

            if (!errorObject.data) {
                throw Error(
                    "Failed to parse data field error object:" + errorObjectStr
                )
            }

            if (errorObject.data.startsWith("Reverted 0x")) {
                // Trim "Reverted 0x" from the data field
                rawMessageData = errorObject.data.slice(11)
            } else if (errorObject.data.startsWith("0x")) {
                // Trim "0x" from the data field
                rawMessageData = errorObject.data.slice(2)
            } else {
                throw Error(
                    "Failed to parse data field of error object:" +
                        errorObjectStr
                )
            }
        } else {
            throw Error(
                "Failed to parse error message from Ethereum call: " + e.message
            )
        }
    }

    return parseReasonCode(rawMessageData)
}

export const parseReasonCode = (messageData: string): string => {
    // Get the length of the revert reason
    const strLen = parseInt(messageData.slice(8 + 64, 8 + 128), 16)
    // Using the length and known offset, extract and convert the revert reason
    const reasonCodeHex = messageData.slice(8 + 128, 8 + 128 + strLen * 2)
    // Convert reason from hex to string
    const reason = toUtf8String("0x" + reasonCodeHex)

    return reason
};
