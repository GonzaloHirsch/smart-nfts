import { EXTENSIONS, PARAMETER_TYPE, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class Enumerable {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.ERC721Enumerable;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [];
    }
    public static getExtensionVariables(): IContractVariable[] {
        return [];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [
            {
                name: '_beforeTokenTransfer',
                params: [
                    {
                        name: 'from',
                        type: PARAMETER_TYPE.ADDRESS
                    },
                    {
                        name: 'to',
                        type: PARAMETER_TYPE.ADDRESS
                    },
                    {
                        name: 'tokenId',
                        type: PARAMETER_TYPE.UINT256
                    },
                ],
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