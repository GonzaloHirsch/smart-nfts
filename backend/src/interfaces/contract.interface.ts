import { FINAL_EXTENSIONS, STATE_MUTABILITY, VISIBILITY, EXTENSIONS } from "../constants/contract.constants";
import { IArguments, IParameter } from "./general.interface";

export interface IContract {
    // Getters
    getImports(): string[];  
    getExtensions(): EXTENSIONS[];            
    getFinalExtensions(): FINAL_EXTENSIONS[]; 
    getUserInputs(): IArguments;           
    getName(): string;
    getSymbol(): string;     
    getLibraries(): IContractLibrary[];                 
    getVariables(): IContractVariable[];  
    getConstructorContent(): string[];      
    getMethods(): IContractMethod[];      
}

export interface IContractExtension {
    // Static methods
    getExtensionOZImports(): string[];             // import from open zeppling
    getExtensionInputs(): IParameter[];                // strings that must be replaced by input
    getExtensionName(): EXTENSIONS;                // Name of extension (ex: ERC721URIStorage)
    getExtensionLibs(): IContractLibrary[];        // For including a library within a contract in solidity.
    getExtensionVariables(): IContractVariable[];  // Necessary class variables
    getExtensionConstructorContent(): string[];    // Content the extension needs in the constructor
    getExtensionMethods(): IContractMethod[];      // Methods to implement with extension
    getParentExtension(): EXTENSIONS | null;       // If extension is adding upon or overriding a parent extension. 
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
    returns?: string,
    solidityRequired?: boolean;
}