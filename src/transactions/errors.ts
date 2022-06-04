/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//import { TransactionResponse } from "@ethersproject/abstract-provider"
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
};
