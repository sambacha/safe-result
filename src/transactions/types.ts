/**
* @transactions
* @typeOf
* @since v0.3.0
* @summary TODO
*/ 
export enum MessageType {
    Unknown,
    Call,
    Create,
    Selfdestruct,
    DelegateCall,
    StaticCall,
}

export type Param = {
    name: string
    type: string
    value?: string
    components?: Param[]
}

export type Trace = {
    id: number
    type: MessageType
    from: string
    // For child traces of delegate calls. delegatedFrom = the parent delegate call's to address
    delegatedFrom: string
    to: string
    value: BigNumber
    funcSelector?: string
    funcName?: string
    inputs?: string
    inputParams?: Param[]
    parsedConstructorParams?: boolean
    outputs?: string
    outputParams?: Param[]
    proxy?: boolean
    gasLimit: BigNumber
    gasUsed: BigNumber
    parentTrace?: Trace
    childTraces: Trace[]
    depth: number
    error?: string
}

export type Event = {
    name: string
    params: Param[]
}

export type Contract = {
    address: string
    contractName?: string
    appName?: string
    balance?: number
    tokenName?: string
    symbol?: string
    decimals?: number
    proxyImplementation?: string
    ethersContract?: EthersContract
    delegatedToContracts?: Contract[]
    constructorInputs?: string
    events?: Event[]
    minDepth?: number
}

export type TokenDetails = {
    address: string
    name?: string
    symbol?: string
    decimals?: number
}

export type Contracts = { [address: string]: Contract }

export type Token = {
    address: string
    name: string
    symbol: string
    decimals?: number
    totalSupply?: BigNumber
}

export type Transfer = {
    from: string
    to: string
    value: BigNumber
    ether: boolean
    tokenAddress?: string
    tokenSymbol?: string
    tokenName?: string
    decimals?: number
}

export interface TransactionDetails {
    hash: string
    from: string
    to: string
    data: string
    nonce: number
    index: number
    value: BigNumber
    gasPrice: BigNumber
    gasLimit: BigNumber
    gasUsed: BigNumber
    timestamp: Date
    status: boolean
    blockNumber: number
    logs: Array<Log>
    error?: string
}

type ParamTypeInternal = {
    name: string
    type: string
    baseType: string
    components?: ParamTypeInternal[]
}
