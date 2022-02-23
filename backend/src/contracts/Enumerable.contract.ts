import { EXTENSIONS, CONTRACT_TYPES, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';
import { IParameter } from "../interfaces/general.interface";

@staticImplements<IContractExtension>()
export abstract class Enumerable {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"];
    }
    public static getExtensionInputs(): IParameter[] {
        return [];
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
    public static getExtensionConstructorContent(): string[] {
        return [];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [
            {
                name: '_beforeTokenTransfer',
                params: [
                    {
                        name: 'from',
                        type: CONTRACT_TYPES.ADDRESS
                    },
                    {
                        name: 'to',
                        type: CONTRACT_TYPES.ADDRESS
                    },
                    {
                        name: 'tokenId',
                        type: CONTRACT_TYPES.UINT256
                    },
                ],
                mandatory: true,
                content: ['super._beforeTokenTransfer(from, to, tokenId);\n'],
                visibility: VISIBILITY.INTERNAL,
                overrides: [EXTENSIONS.ERC721, EXTENSIONS.ERC721Enumerable],
                solidityRequired: true
            },
            {
                name: 'supportsInterface',
                params: [{
                    name: 'interfaceId',
                    type: CONTRACT_TYPES.BYTES4
                }],
                mandatory: true,
                content: ['return super.supportsInterface(interfaceId);\n'],
                visibility: VISIBILITY.PUBLIC,
                stateMutability: STATE_MUTABILITY.VIEW,
                overrides: [EXTENSIONS.ERC721, EXTENSIONS.ERC721Enumerable],
                returns: CONTRACT_TYPES.BOOL,
                solidityRequired: true            
            },
        ];
    }    
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}