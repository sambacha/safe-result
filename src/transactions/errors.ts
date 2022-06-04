/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { toUtf8String } from "@ethersproject/strings";
import { Provider, TransactionRequest } from "@ethersproject/providers";


export const extractHostname = (url: string): string => {
  let hostname: string;

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
};

export const getRevertReasonFromError = (error: any): string => {
  return (
    error.message?.split('reason="')[1]?.split('", code')[0] ??
    error.error?.error?.message ??
    "no error message"
  );
};

export const decodeRevertReason = (code: string): string => {
  try {
    let codeString = `0x${code.substr(138)}`.replace(/0+$/, "");
    if (codeString.length % 2 === 1) {
      codeString += "0";
    }
    return toUtf8String(codeString);
  } catch (error) {
    return "Could not decode revert reason";
  }
};

export const getRevertReasonFromTransaction = async (
  provider: Provider,
  tx: TransactionRequest,
  blockNumber: number
): Promise<string> => {
  let revertReason;

  try {
    const code = await provider.call(tx, blockNumber);
    let codeString = `0x${code.substr(138)}`.replace(/0+$/, "");
    if (codeString.length % 2 === 1) {
      codeString += "0";
    }
    revertReason = toUtf8String(codeString);
  } catch (error: any) {
    // Locally it will throw
    revertReason = error.error?.message.split(
      "VM Exception while processing transaction: revert "
    )[1];
  }

  return revertReason;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSimplifiedErrorMessageFromEthersError = (error: any) => {
  try {
    const jsonError = JSON.parse(JSON.stringify(error));
    if (jsonError.reason && jsonError.code) {
      if (jsonError.error && jsonError.error.reason && jsonError.error.code) {
        if (jsonError.error.serverError) {
          return `reason: ${jsonError.reason}, code: ${
            jsonError.code
          }, error: { reason: ${jsonError.error.reason}, code: ${
            jsonError.error.code
          }, serverErrorCode: ${jsonError.error.serverError.code}${
            jsonError.error.url
              ? `, url: ${extractHostname(jsonError.error.url)}`
              : ""
          }}`;
        }
        return `reason: ${jsonError.reason}, code: ${
          jsonError.code
        }, error: { reason: ${jsonError.error.reason}, code: ${
          jsonError.error.code
        }${
          jsonError.error.url
            ? `, url: ${extractHostname(jsonError.error.url)}`
            : ""
        } }`;
      }
      return `reason: ${jsonError.reason}, code: ${jsonError.code}`;
    } else return error.message;
  } catch (e) {
    return error.message;
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
