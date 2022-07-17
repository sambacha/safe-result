/**
 * @file regEx
 * @exports ethereumAddress
 * @exports bytes
 * @exports bytes4
 * @exports bytes32
 * @exports bytes64
 * @exports transactionHash
 * @see {@link https://eslint.org/docs/rules/require-unicode-regexp}
 * @source {@link https://github.com/naddison36/tx2uml/blob/master/src/ts/utils/regEx.ts}
 * @license MIT Copyright (c) 2021 Nick Addison
 */


interface SymbolConstructor {
    /**
     * A regular expression method that matches the regular expression against a string. Called
     * by the String.prototype.matchAll method.
     */
    readonly matchAll: unique symbol;
}

interface RegExp {
    /**
     * Matches a string with this regular expression, and returns an iterable of matches
     * containing the results of that search.
     * @param string A string to search within.
     */
    [Symbol.matchAll](str: string): IterableIterator<RegExpMatchArray>;
}


/*eslint require-unicode-regexp: error */
export const ethereumAddress = /^0x([A-Fa-f0-9]{40})$/;
// @NOTE this is also equivalent: ^0x([0-9a-z]{2})*$
export const bytes = /^0x([A-Fa-f0-9]{2})$/;
export const bytes4 = /^0x([A-Fa-f0-9]{8})$/;
export const bytes32 = /^0x[0-9a-z]{64}$/;
export const bytes64 = /^0x([A-Fa-f0-9]{128})$/;
export const transactionHash = bytes32;
