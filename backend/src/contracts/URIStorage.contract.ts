import { EXTENSIONS, CONTRACT_TYPES, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class URIStorage {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"];
    }
    public static getExtensionInputs(): string[] {
        return [];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.ERC721URIStorage;
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
                name: 'safeMint',
                params: [{
                    name: 'uri',
                    type: CONTRACT_TYPES.STRING_MEMORY
                }],
                mandatory: false,
                content: ['_setTokenURI(tokenId, uri);\n'],
                visibility: VISIBILITY.PUBLIC,
                options: ''
            },
            {
                name: 'tokenURI',
                params: [{
                    name: 'tokenId',
                    type: CONTRACT_TYPES.UINT256
                }],
                mandatory: true,
                content: ['return super.tokenURI(tokenId);\n'],
                visibility: VISIBILITY.PUBLIC,
                stateMutability: STATE_MUTABILITY.VIEW,
                overrides: [EXTENSIONS.ERC721, EXTENSIONS.ERC721URIStorage],
                returns: CONTRACT_TYPES.STRING_MEMORY,
                solidityRequired: true            
            },
            {
                name: '_burn',
                params: [{
                    name: 'tokenId',
                    type: CONTRACT_TYPES.UINT256
                }],
                mandatory: true,
                content: ['super._burn(tokenId);\n'],
                visibility: VISIBILITY.INTERNAL,
                overrides: [EXTENSIONS.ERC721, EXTENSIONS.ERC721URIStorage],
                solidityRequired: true
            },
        ];
    }    
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}