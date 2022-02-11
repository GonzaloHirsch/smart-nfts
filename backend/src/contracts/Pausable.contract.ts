import { EXTENSIONS, CONTRACT_TYPES, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class Pausable {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/security/Pausable.sol", "@openzeppelin/contracts/access/Ownable.sol"];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.Pausable;
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
                name: 'pause',
                params: [],
                mandatory: true,
                content: ['_pause();\n'],
                visibility: VISIBILITY.PUBLIC,
                options: 'onlyOwner'
            },
            {
                name: 'unpause',
                params: [],
                mandatory: true,
                content: ['_unpause();\n'],
                visibility: VISIBILITY.EXTERNAL,
                options: 'onlyOwner'
            },
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
                    }
                ],
                mandatory: true,
                content: ['super._beforeTokenTransfer(from, to, tokenId);\n'],
                visibility: VISIBILITY.INTERNAL,
                options: 'whenNotPaused',
                overrides: []
            }
        ];
    }    
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}