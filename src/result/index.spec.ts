export interface IResultOk<T> {
  res: T;
  err?: undefined;
}

export interface IResultErr {
  res?: undefined;
  err: string;
}

export type TResult<T> = IResultOk<T> | IResultErr;

export class Result<T> {
  public static from<T>(value: TResult<T>) {
    return new Result(value);
  }

  private readonly val: TResult<T>;

  constructor(value: TResult<T>) {
    this.val = value;
  }

  public and<U>(func: (arg: T) => Result<U>) {
    if (this.isOk(this.val)) {
      const nextAssertable = func(this.val.res);
      const nextVal = nextAssertable.toVal();
      if (nextAssertable.isOk(nextVal)) {
        return Result.from({ res: nextVal.res });
      } else {
        return Result.from<U>({
          err: nextVal.err,
        });
      }
    } else {
      return Result.from<U>({ err: this.val.err });
    }
  }

  public unwrap() {
    if (this.isOk(this.val)) {
      return this.val.res;
    }
    throw Error(this.val.err);
  }

  public expect(msg: string) {
    if (this.isOk(this.val)) {
      return this.val.res;
    }
    throw Error(msg);
  }

  public ok() {
    return !this.val.err;
  }

  public err() {
    return this.val.err;
  }

  public toVal() {
    return this.val;
  }

  private isOk(val: TResult<T>): val is IResultOk<T> {
    return !val.err;
  }
}