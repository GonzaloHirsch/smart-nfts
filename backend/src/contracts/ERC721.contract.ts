import { EXTENSIONS, CONTRACT_TYPES, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class ERC721 {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/ERC721.sol"];
    }
    public static getExtensionInputs(): string[] {
        return [];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.ERC721;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [];
    }
    public static getExtensionVariables(): IContractVariable[] {
        return [];
    }
    public static getExtensionConstructorContent(): string[] {
        return [];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [];
    }
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}