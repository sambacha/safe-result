/**
 * 
 * @export emptyValues
 * @summary Empty values used to determine if a request should be retried
 * `<nil>` comes from https://github.com/ethereum/go-ethereum/issues/16925
 */
 
const emptyValues: (string | null | undefined)[] = [
  undefined,
  null,
  '\u003cnil\u003e',
];

export { emptyValues }
