import { CONTRACT_TYPES } from "../constants/contract.constants";

export interface IParameter {
    name: string,
    type: CONTRACT_TYPES | string // string since it can also belong to a library
}

export interface IArguments {
    [name: string]: any
}