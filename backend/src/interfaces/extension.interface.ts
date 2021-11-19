import { STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { EXTENSIONS } from "../constants/extension.constants";
import { IParameter } from "./general.interface";

export interface IContractExtension {
    // Static methods
    getExtensionOZImport(): string;                 // import from open zeppling
    getExtensionName(): EXTENSIONS;                 // Name of extension (ex: ERC721URIStorage)
    getExtensionVariables(): IExtensionVariable[];  // Necessary class variables
    getExtensionMethods(): IExtensionMethod[];      // Methods to implement with extension
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