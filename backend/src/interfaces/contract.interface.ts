import { STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { EXTENSIONS } from "../constants/contract.constants";
import { IParameter } from "./general.interface";

export interface IContract {
    // Getters
    getImports(): string[];  
    getExtensions(): EXTENSIONS[];            
    getName(): string;
    getSymbol(): string;     
    getLibraries(): IContractLibrary[];                 
    getVariables(): IContractVariable[];  
    getMethods(): IContractMethod[];      
}

export interface IContractExtension {
    // Static methods
    getExtensionOZImports(): string[];             // import from open zeppling
    getExtensionName(): EXTENSIONS;                // Name of extension (ex: ERC721URIStorage)
    getExtensionLibs(): IContractLibrary[];         // For including a library within a contract in solidity.
    getExtensionVariables(): IContractVariable[];  // Necessary class variables
    getExtensionMethods(): IContractMethod[];      // Methods to implement with extension
}

export interface IContractLibrary {
    name: string,   
    for: string
}

export interface IContractVariable extends IParameter {
    visibility: VISIBILITY
}

export interface IContractMethod {
    name: string;
    params: IParameter[];
    mandatory: boolean;
    content: string[];
    visibility?: VISIBILITY;
    options?: string;
    stateMutability?: STATE_MUTABILITY;
    overrides?: EXTENSIONS[]; // Only override if the extension is included
    returns?: string
}