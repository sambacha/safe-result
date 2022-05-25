# [safe-result](#)

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)


### safeSend React Wallet

Example Connect / Disconnect button

```ts
const ConnectWalletButton = () => {
  const { account, connect, disconnect } = useWallet();
  return (
    <>
      {!account ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <button onClick={() => disconnect()}>Disconnect Wallet</button>
      )}
    </>
  );
};
```

The connect function passes along an optional config to a Web3Modal instance for
additional customization.

You can use the account information from useWallet anywhere inside your React
app, without any extra set up.

```ts
const UserAddress = () => {
  const { account } = useWallet();
  if (!account) return null;
  return <>{account}</>;
};
```

To run a transaction or sign a message, use the provider object returned by the
hook for connected wallets.

> This is a standard Ethers.js Provider.

```ts
const SignMessageButton = () => {
  const { account, provider } = useWallet();
  if (!account) return null;
  const signMessage = async () => {
    const signature = await provider.getSigner().signMessage("Hello!");
    console.log(signature);
  }
  return <button onClick={signMessage}>Sign Message</>;
}
```


<pre>
logDebug logTrace "This is how a Debug message looks like."
logInfo logTrace "This is how an Info message looks like." 
logNotice logTrace "This is how a Notice message looks like."
logWarning logTrace "This is how a Warning message looks like."
logError logTrace "This is how an Error message looks like."
logCritical logTrace "This is how a Critical message looks like."
logAlert logTrace "This is how an Alert message looks like."
logEmergency logTrace "This is how an Emergency message looks like."



isIdle, 
isLoading, 
isSuccess,
isError



Future<Result<Ok, Error>>

isPending
isCancelled
isResolved

resolver
rejector


.isLoading()
.isDone()
.isNotAsked()


.isOk()
.isError()


## Ethers Interface

```typesript
// ethers v6 compatible, this is the interface

export type FormatFunc = (value: any) => any;

export type AccessListSet = { address: string, storageKeys: Array<string> };
export type AccessList = Array<AccessListSet>;

export type AccessListish = AccessList |
                            Array<[ string, Array<string> ]> |
                            Record<string, Array<string>>;

function stringify(value: any): string {
    if (typeof(value) !== "string") { throw new Error("invalid string"); }
    return value;
}

export class Formatter {
    #format: {
        address: FormatFunc,
        bigNumber: FormatFunc,
        blockTag: FormatFunc,
        data: FormatFunc,
        filter: FormatFunc,
        hash: FormatFunc,
        number: FormatFunc,
        topics: FormatFunc,
        transactionRequest: FormatFunc,
        transactionResponse: FormatFunc,
        uint256: FormatFunc,
    };

    #baseBlock: FormatFunc;

    constructor() {
        const address = this.address.bind(this);
        const bigNumber = this.bigNumber.bind(this);
        const blockTag = this.blockTag.bind(this);
        const data = this.data.bind(this);
        const hash = this.hash.bind(this);
        const number = this.number.bind(this);
        const uint256 = this.uint256.bind(this);

        const topics = this.arrayOf(hash);

        this.#format = {
            address,
            bigNumber,
            blockTag,
            data,
            hash,
            number,
            uint256,

            topics,

            filter: this.object({
                fromBlock: this.allowNull(blockTag, undefined),
                toBlock: this.allowNull(blockTag, undefined),
                blockHash: this.allowNull(hash, undefined),
                address: this.allowNull(address, undefined),
                topics: this.allowNull(topics, undefined)
            }),

            transactionRequest: this.object({
                from: this.allowNull(address),
                type: this.allowNull(number),
                to: this.allowNull(address),
                nonce: this.allowNull(number),
                gasLimit: this.allowNull(uint256),
                gasPrice: this.allowNull(uint256),
                maxFeePerGas: this.allowNull(uint256),
                maxPriorityFeePerGas: this.allowNull(uint256),
                data: this.allowNull(data),
                value: this.allowNull(uint256),
            }),

            transactionResponse: this.object({
                hash: hash,
                index: number,

                type: this.allowNull(number, 0),

                // These can be null for pending blocks
                blockHash: this.allowNull(hash),
                blockNumber: this.allowNull(number),

                // For Legacy transactions, this comes from the v
                chainId: this.allowNull(number),

                from: address,
                to: this.address,

                gasLimit: bigNumber,

                gasPrice: this.allowNull(bigNumber),
                maxFeePerGas: this.allowNull(bigNumber),
                maxPriorityFeePerGas: this.allowNull(bigNumber),

                value: bigNumber,
                data: data,
                nonce: number,
                r: hash,
                s: hash,
                v: number,
                accessList: this.allowNull(this.accessList)
            }, {
                index: [ "transactionIndex" ]
            }),
        };
```
