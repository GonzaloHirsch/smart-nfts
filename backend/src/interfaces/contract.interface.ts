import { STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { EXTENSIONS } from "../constants/extension.constants";
import { IParameter } from "./general.interface";

export interface IContract {
    imports: string[];
    name: string;
    symbol: string;
    using: string;
    variables: IContractVariable[];  
    methods: IContractMethod[];
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
    [hash: string] : {
        name: string,   
        for: string
    }
}

export interface IContractVariable extends IParameter {
    visibility: VISIBILITY
}

export interface IContractMethod {
    name: string;
    params: {
        [hash: string] : IParameter
    };
    mandatory: boolean;
    content: string[];
    visibility?: VISIBILITY;
    options?: string;
    stateMutability?: STATE_MUTABILITY;
    overrides?: EXTENSIONS[];
    returns?: string
}