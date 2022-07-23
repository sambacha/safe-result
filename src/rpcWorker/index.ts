/* eslint-disable no-restricted-globals */
export type WorkerModule = Record<string, (...args: any) => any>;

export type Remote<T extends WorkerModule> = {
  [K in keyof T]: (
    T[K] extends (...args: infer Args) => infer R
    ? (...args: Args) => (R extends Promise<any> ? R : Promise<R>)
    : never
  );
};

type TransferableFactory<T extends any[]> = (...args: T) => Transferable[];

export type LocalTransferableFactoryMap<T extends WorkerModule> = Partial<{
  [K in keyof T]: TransferableFactory<Parameters<T[K]>>;
}>;

const enum Completion {
  resolve,
  reject,
};

const noTransferable: Transferable[] = [];
const noTransferableFactory = () => noTransferable;
const noFactoryMap = {};

const wrap = <T extends WorkerModule>(
  worker: Worker, factoryMap: LocalTransferableFactoryMap<T> = noFactoryMap,
) => {
  let id = 0;
  const completions: Map<number, Parameters<ConstructorParameters<PromiseConstructor>[0]>> = new Map();
  const listener = <K extends keyof T>(event: MessageEvent<[id: number, completion: Completion, result: ReturnType<T[K]>]>) => {
    const { 0: id, 1: completion, 2: result } = event.data;
    const settle = completions.get(id)![completion];

    completions.delete(id);
    settle(result);
  };
  const { proxy, revoke } = Proxy.revocable<Remote<T>>(Object.create(null), {
    get: (target, key) => {
      if (typeof key === 'string' && !(key in target)) {
        const method = (...args: Parameters<T[keyof T]>) => new Promise((resolve, reject) => {
          const { [key as keyof T]: factory = noTransferableFactory } = factoryMap;

          completions.set(id, [resolve, reject]);
          worker.postMessage([key, id, args], factory.apply(undefined, args));
          id = (id + 1) % Number.MAX_SAFE_INTEGER;
        });

        (target[key as keyof T] as any) = method;
      }

      return target[key as keyof T];
    } 
  });

  worker.addEventListener('message', listener);

  return {
    proxy,
    revoke: () => {
      worker.removeEventListener('message', listener);
      revoke();
    }
  };
};

export type RemoteTransferableFactoryMap<T extends WorkerModule> = Partial<{
  [K in keyof T]: TransferableFactory<[ReturnType<T[K]>]>;
}>;

const expose = <T extends WorkerModule>(
  workerModule: T, factoryMap: RemoteTransferableFactoryMap<T> = noFactoryMap,
) => {
  const listener = async <K extends keyof T>(event: MessageEvent<[key: K, id: number, args: Parameters<T[K]>]>) => {
    const { 0: key, 1: id, 2: args } = event.data;
    const method = workerModule[key];
    const { [key]: factory = noTransferableFactory } = factoryMap;

    try {
      const value = await method.apply(undefined, args);

      postMessage([id, Completion.resolve, value], factory(value));
    } catch (reason) {
      postMessage([id, Completion.reject, reason]);
    }
  };

  addEventListener('message', listener);
};

export { wrap, expose };
