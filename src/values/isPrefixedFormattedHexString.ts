/**
 * Checks whether the given value is a 0x-prefixed, non-zero, non-zero-padded, hexadecimal string.
 * 
 * @export isPrefixedFormattedHexString
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is a correctly formatted hex string,
 *    false otherwise.
 */

export function isPrefixedFormattedHexString(value) {
	if (typeof value !== 'string') {
		return false;
	}
	return /^0x[1-9a-f]+[0-9a-f]*$/iu.test(value);
}
