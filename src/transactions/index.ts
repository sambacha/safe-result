/**
* @module Transactions
* @see {@link https://github.com/ethers-io/ethers.js/blob/a17b249dbfc103219da3c9eac0e14cc837bfe92d/packages/logger/src.ts/index.ts}
* @summary Part of this module (the logging) is extracted from v6 Ethers
*   When v6 is stable release, this should be removed and upstream added as a dependency
* @author github.com/ricmoo
* @license MIT
*/

export { ErrorCode, isError,isCallException, /** isContractCallException */ } from "./errors.js";

export { Logger } from "./logger.js";

/** 
* @export type Errors
*/
export type {
  EthersError, CodedEthersError,
  BadDataError,
  BufferOverrunError,
  CallExceptionError,
  InsufficientFundsError,
  InvalidArgumentError,
  MissingArgumentError,
  NetworkError,
  NonceExpiredError,
  NotImplementedError,
  NumericFaultError,
  OffchainFaultError,
  ReplacementUnderpricedError,
  ServerError, TransactionReplacedError,
  TimeoutError,
  UnconfiguredNameError,
  UnexpectedArgumentError,
  UnknownError,
  UnpredictableGasLimitError,
  UnsupportedOperationError, } from "./errors.js";

/** 
* @export type Logger
*/
export type {
  BytesLike,
  BigNumberish,
  ErrorInfo,
  Numeric
} from "./logger.js";
