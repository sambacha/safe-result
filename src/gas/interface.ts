export interface GasPricing {
    blockPrices?:        BlockPrice[];
    currentBlockNumber?: number;
    maxPrice?:           number;
    msSinceLastBlock?:   number;
    network?:            string;
    system?:             string;
    unit?:               string;
}

export interface BlockPrice {
    baseFeePerGas?:             number;
    blockNumber?:               number;
    estimatedPrices?:           EstimatedPrice[];
    estimatedTransactionCount?: number;
}

export interface EstimatedPrice {
    confidence:           number;
    maxFeePerGas:         number;
    maxPriorityFeePerGas: number;
    price:                number;
}
