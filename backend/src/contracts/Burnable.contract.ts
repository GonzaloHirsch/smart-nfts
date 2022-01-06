import { EXTENSIONS } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class Burnable {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol"];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.ERC721Burnable;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [];
    }
    public static getExtensionVariables(): IContractVariable[] {
        return [];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [];
    }
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}