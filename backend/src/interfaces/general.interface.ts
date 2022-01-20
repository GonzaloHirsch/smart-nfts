import { PARAMETER_TYPE } from "../constants/contract.constants";

export interface IParameter {
    name?: string,
    type: PARAMETER_TYPE | string // string since it can also belong to a library
}