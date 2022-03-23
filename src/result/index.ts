
   
import { Result } from '@src/index';

/**
 * Lets say we want to have validation functions
 * for opqaue types based on strings, but we also want
 * to seperate the concerns of expected and unexpected errors.
 * This is a great usecase for nano-result, as it lets us
 * handle expected errors via IResultErr, and unexpected
 * results via the conventional try {} catch {} statement.
 * Below you'll see how to create and combine results to effectively
 * handle errors within your program.
 *
 */

// opaque type defining an unprefixed hex string
type UnprefixedHexString = string & { tag: '__unprefixed__hex__' };

// opqaue type defining a prefixed hex string (has "0x" prefix)
type PrefixedHexString = string & { tag: '__prefixed__hex__' };

// union of both as they're both valid hex strings
type HexString = UnprefixedHexString | PrefixedHexString;

/**
 * @description  A function that validates that any given
 * hex string input is a prefixed hex string too. Returns a
 * result of the opaque type {PrefixedHexString} if so, otherwise
 * returns an expected error of `${hexStr} does not have a hex prefix`
 * @param {HexString} hexStr
 * @returns {Result<PrefixedHexString>}
 */
function isHexPrefixed(hexStr: HexString): Result<PrefixedHexString> {
  if (hexStr.length >= 2 && hexStr.slice(0, 2) === '0x') {
    return Result.from({ res: hexStr as PrefixedHexString });
  }
  return Result.from({ err: `${hexStr} does not have a hex prefix` });
}

/**
 *
 * @description A function that validates any given string
 * to be a valid hex string.
 * @param {string} str
 * @returns {Result<HexString>}
 */
function isHexString(str: string): Result<HexString> {
  if (
    /* Match against unprefixed hex string */
    str.match(/^[0-9A-Fa-f]*$/) ||
    /* Match against prefixex hex string */
    str.match(/^0x[0-9A-Fa-f]*$/)
  ) {
    return Result.from({ res: str as HexString });
  }
  return Result.from({ err: `${str} is not a hex string` });
}

/**
 *
 * @description A function that validates any given string
 * is also a prefixed hex string, uses "and" method
 * on the Result returned from "isHexString" to chain the results
 * together
 * @param {string} str
 * @returns {Result<PrefixedHexString>}
 */
function isPrefixedHexString(str: string): Result<PrefixedHexString> {
  return isHexString(str).and(isHexPrefixed);
}

describe('isPrefixedHexString', () => {
  it('Should short circuit on failed results chained via "and" method', () => {
    const e: Result<PrefixedHexString> = isPrefixedHexString('zz');

    expect(e.err()).toEqual('zz is not a hex string');
  });

  it('Should return the second failed result via "and" method', () => {
    const e: Result<PrefixedHexString> = isPrefixedHexString('0e2');

    expect(e.err()).toEqual('0e2 does not have a hex prefix');
  });

  it('should return the result of the validated prefixed hex string', () => {
    // note that the resulting type is the ending result type of the chained Results
    const r: Result<PrefixedHexString> = isPrefixedHexString('0xe2');

    expect(r.unwrap()).toEqual('0xe2');
  });
});