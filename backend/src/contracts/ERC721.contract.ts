import { EXTENSIONS } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';
import { IParameter } from "../interfaces/general.interface";

@staticImplements<IContractExtension>()
export abstract class ERC721 {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/ERC721.sol"];
    }
    public static getExtensionInputs(): IParameter[] {
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