import { EXTENSIONS, PARAMETER_TYPE, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class Enumerable {
    
    public static getExtensionOZImports(): string[] {
        return [];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.ListTokens;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [];
    }
    public static getExtensionVariables(): IContractVariable[] {
        return [{
            name: 'tokenIds',
            type: PARAMETER_TYPE.UINT256_ARRAY,
            visibility: VISIBILITY.PUBLIC
        }];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [
            {
                name: 'listTokens',
                params: [],
                mandatory: true,
                content: ['return super.supportsInterface(interfaceId);\n'],
                visibility: VISIBILITY.INTERNAL,
                overrides: [EXTENSIONS.ERC721, EXTENSIONS.ERC721Enumerable],
                solidityRequired: true
            },
            {
                name: 'supportsInterface',
                params: [{
                    name: 'interfaceId',
                    type: PARAMETER_TYPE.BYTES4
                }],
                mandatory: true,
                content: ['return super.supportsInterface(interfaceId);\n'],
                visibility: VISIBILITY.PUBLIC,
                stateMutability: STATE_MUTABILITY.VIEW,
                overrides: [EXTENSIONS.ERC721, EXTENSIONS.ERC721Enumerable],
                returns: PARAMETER_TYPE.BOOL,
                solidityRequired: true            
            },
        ];
    }    
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}