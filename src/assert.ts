// @type AssertEqual 
export type AssertEqual<T, U> = [T, U] extends [U, T] ? true : never;

// Assert
export function number(n: number) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`#[Assert]: Wrong positive integer: ${n}`);
}

export function bool(b: boolean) {
  if (typeof b !== 'boolean') throw new Error(`#[Assert]: Expected boolean, not ${b}`);
}

export function bytes(bytes: Uint8Array, ...lengths: number[]) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('#[Assert]: Type Expected Uint8Array');
  if (lengths.length > 0 && !lengths.includes(bytes.length))
    throw new TypeError(`#[Assert]: Type Expected Uint8Array of length ${lengths}, not of length=${bytes.length}`);
}

type Hash = {
  (data: Uint8Array): Uint8Array;
  blockLen: number;
  outputLen: number;
  create: any;
};
export function hash(hash: Hash) {
  if (typeof hash !== 'function' || typeof hash.create !== 'function')
    throw new Error('#[Assert]: Hash should be wrapped by utils.wrapConstructor');
  number(hash.outputLen);
  number(hash.blockLen);
}

export function exists(instance: any, checkFinished = true) {
  if (instance.destroyed) throw new Error('Hash instance has been destroyed');
  if (checkFinished && instance.finished) throw new Error('Hash#digest() has already been called');
}
export function output(out: any, instance: any) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`#[Assert]: digestInto() expects output buffer of length at least ${min}`);
  }
}

export function assertNever(x: never): never {
    throw new Error('#[Assert]: Unexpected value. type never violation');
}

/** 
* @export ∀
* @summary Assertion using typescripts `asserts` 
*/
export function ∀(value: boolean, message?: string): asserts value;
export function ∀<T>(value: T | null | undefined, message?: string): asserts value is T;
export function ∀(value: any, message?: string) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message || "∀ssertion failed")
  }
}



export function stateAssert(value: unknown, message: string | Error): asserts value {
  if (!value) throw message instanceof Error ? message : new Error(message);
}


const assert = {
  number,
  bool,
  bytes,
  hash,
  exists,
  output,
  assertNever,
  ∀,
  stateAssert,
};


export default assert;
