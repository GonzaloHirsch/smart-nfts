import { EXTENSIONS } from "../constants/extension.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";

@staticImplements<IContractExtension>()
export abstract class ERC721 {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/ERC721.sol"];
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
    public static getExtensionMethods(): IContractMethod[] {
        return [];
    }
    
}