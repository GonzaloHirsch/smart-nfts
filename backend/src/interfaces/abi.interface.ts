import { METHOD_TYPE, PARAMETER_TYPE, STATE_MUTABILITY } from "../constants/contract.constants";

export type IAbi = IAbiMethod[];

export interface IAbiMethod {
    name: string,
    type: METHOD_TYPE,
    anonymous?: boolean,
    inputs: IAbiInput[],
    outputs: IAbiArgument[],
    stateMutability?: STATE_MUTABILITY
};

export interface IAbiInput extends IAbiArgument {
    indexed?: boolean,
};

export interface IAbiArgument {
    name: string,
    type: PARAMETER_TYPE,
    internalType: PARAMETER_TYPE
};