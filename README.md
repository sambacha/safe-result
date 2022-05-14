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
