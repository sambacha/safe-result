# [safe-result](#)

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)


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
