import { Result } from '@src/index';

describe('Success Tests', () => {
  it('Should create a result instance that is successful', () => {
    const r = Result.from({ res: 'hello world' });
    expect(r.toVal()).toEqual({ res: 'hello world' });
  });

  it('Should unwrap value using "unwrap" method on success', () => {
    const r = Result.from({ res: 'hello world' });
    expect(r.unwrap()).toEqual('hello world');
  });

  it('Should unwrap via "expect" method on success', () => {
    const r = Result.from({ res: 'hello world' });
    expect(r.expect('Invalid string')).toEqual('hello world');
  });

  it('Should return a boolean true value on success when using "ok" method', () => {
    const r = Result.from({ res: 'hello world' });
    expect(r.ok()).toEqual(true);
  });

  it('Should chain values and their types using the "and" method ', () => {
    const f1 = (n: number): Result<string> => Result.from({ res: `${n}` });
    const f2 = (str: string): Result<number> => Result.from({ res: +str });
    const r = f1(5).and(f2);
    expect(r.unwrap()).toEqual(5);
  });

  it('Should return false when checking if there is an error on a success result', () => {
    const r = Result.from({ res: 'hello world' });
    expect(!!r.err()).toEqual(false);
  });
});

describe('Failure tests', () => {
  it('Should have error as a value', () => {
    const e = Result.from({ err: 'err' });
    expect(e.toVal()).toEqual({ err: 'err' });
  });
  it('Should throw with the contained error message on "unwrap" method', () => {
    const e = Result.from({ err: 'err' });
    expect(() => e.unwrap()).toThrowError('err');
  });
  it('Should throw with supplied expected error message on "expect" method', () => {
    const e = Result.from({ err: 'err' });
    expect(() => e.expect('Custom error')).toThrowError('Custom error');
  });
  it('Should return the error string on "err" method', () => {
    const e = Result.from({ err: 'err' });
    expect(e.err()).toEqual('err');
  });

  it('Should return false when "ok" method is called', () => {
    const e = Result.from({ err: 'err' });
    expect(e.ok()).toEqual(false);
  });

  it('Should short circuit on failed results chained via "and" method', () => {
    const f1 = (_: number): Result<string> => Result.from({ err: 'first' });
    const f2 = (_: string): Result<number> => Result.from({ err: 'second' });
    const r = f1(5).and(f2);
    expect(r.err()).toEqual('first');
  });

  it('Should return the second failed result via "and" method', () => {
    const f1 = (_: number): Result<string> => Result.from({ res: 'first' });
    const f2 = (_: string): Result<number> => Result.from({ err: 'second' });
    const r = f1(5).and(f2);
    expect(r.err()).toEqual('second');
  });
});
