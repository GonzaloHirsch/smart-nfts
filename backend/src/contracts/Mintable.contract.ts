import { EXTENSIONS, CONTRACT_TYPES, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class Mintable {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/access/Ownable.sol"];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.Mintable;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [];
    }
    public static getExtensionVariables(): IContractVariable[] {
        return [];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [{
            name: 'safeMint',
            params: [
                {
                    name: 'to',
                    type: CONTRACT_TYPES.ADDRESS
                },
                {
                    name: 'tokenId',
                    type: CONTRACT_TYPES.UINT256
                }
            ],
            mandatory: true,
            content: ['_safeMint(to, tokenId);\n'],
            visibility: VISIBILITY.PUBLIC,
            options: 'onlyOwner'
        }];
    }
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}