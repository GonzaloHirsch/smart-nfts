import { STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { EXTENSIONS } from "../constants/extension.constants";
import { IParameter } from "./general.interface";

export interface IContractExtension {

    // Class variables
    extension: EXTENSIONS;
    variables: IExtensionVariable[];
    methods: IExtensionMethod[];

    // Class methods
    getExtensionVariables(): IExtensionVariable[];
    getExtensionMethods(): IExtensionMethod[];
}

export interface IExtensionVariable extends IParameter {
    visibility: VISIBILITY
}

export interface IExtensionMethod {
    name: string;
    params: {
        [hash: string] : IParameter
    };
    mandatory: boolean;
    content: string;
    visibility?: VISIBILITY;
    stateMutability?: STATE_MUTABILITY;
    overrides?: EXTENSIONS[];
    returns?: string
}