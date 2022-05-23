export function useSingleCallResult(
  contract: Contract | null | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options: Partial<ListenerOptions> & { gasRequired?: number } = {}
): CallState {
  return useSingleContractMultipleData(contract, methodName, [inputs], options)[0] ?? INVALID_CALL_STATE
}

// formats many calls to any number of functions on a single contract, with only the calldata specified
export function useSingleContractWithCallData(
  contract: Contract | null | undefined,
  callDatas: string[],
  options: Partial<ListenerOptions> & { gasRequired?: number } = {}
): CallState[] {
  const gasRequired = options?.gasRequired
  const blocksPerFetch = options?.blocksPerFetch

  // encode calls
  const calls = useMemo(
    () =>
      contract
        ? callDatas.map<Call>((callData) => {
            return {
              address: contract.address,
              callData,
              gasRequired,
            }
          })
        : [],
    [contract, callDatas, gasRequired]
  )

  const results = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined)
    const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result, i) =>
      toCallState(
        result,
        contract?.interface,
        contract?.interface?.getFunction(callDatas[i].substring(0, 10)),
        latestBlockNumber
      )
    )
  }, [results, contract, callDatas, latestBlockNumber])
}
