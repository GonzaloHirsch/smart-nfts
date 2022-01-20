import { METHOD_TYPE, PARAMETER_TYPE, STATE_MUTABILITY } from "../constants/contract.constants";
import { IParameter } from "./general.interface";

export type IAbi = IAbiMethod[];

export interface IAbiMethod {
    name?: string,
    type: METHOD_TYPE,
    anonymous?: boolean,
    inputs: IAbiInput[],
    outputs: IAbiArgument[],
    stateMutability?: STATE_MUTABILITY
};

export interface IAbiInput extends IAbiArgument {
    indexed?: boolean,
};

export interface IAbiArgument extends IParameter {
    internalType: PARAMETER_TYPE
};