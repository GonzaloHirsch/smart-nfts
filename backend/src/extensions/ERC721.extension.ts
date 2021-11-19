import { EXTENSIONS } from "../constants/extension.constants";
import { IContractExtension, IExtensionMethod, IExtensionVariable } from "../interfaces/extension.interface";

@staticImplements<IContractExtension>()
export abstract class ERC721 {
    
    public static getExtensionOZImport(): string {
        return "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.ERC721;
    }
    public static getExtensionVariables(): IExtensionVariable[] {
        return [];
    }
    public static getExtensionMethods(): IExtensionMethod[] {
        return [];
    }
    
}