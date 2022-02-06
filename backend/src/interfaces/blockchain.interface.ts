
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