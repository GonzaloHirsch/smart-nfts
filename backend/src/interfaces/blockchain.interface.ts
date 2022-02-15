import { CONTRACT_TYPES } from "../constants/contract.constants";

export interface ITransactionConfig {
    from?: string | number;
    to?: string;
    value?: number | string;
    gas?: number | string;
    gasPrice?: number | string;
    maxPriorityFeePerGas?: number | string;
    maxFeePerGas?: number | string;
    data?: string;
    nonce?: number;
    chainId?: number;
    chain?: string;
}

export interface IInteractResponse {
    result: any,
    resultType: CONTRACT_TYPES | CONTRACT_TYPES[]
}

export interface IEventDataReturnValues {
    [key: string]: any;
}

// Taken from Web3 library
export interface IEventData {
    returnValues: IEventDataReturnValues;
    raw: {
        data: string;
        topics: string[];
    };
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
}