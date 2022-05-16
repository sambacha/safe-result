// @see {@link TODO}
// @interface EthersBigNumberLike
interface EthersBigNumberLike {
  toHexString(): string;
}

// @interface BNLike
interface BNLike {
  toNumber(): number;
  toString(base?: number): string;
}

// @type NumberLike
export type NumberLike =
  | number
  | bigint
  | string
  | EthersBigNumberLike
  | BNLike;

// @type BlockTag
export type BlockTag = "latest" | "earliest" | "pending";
