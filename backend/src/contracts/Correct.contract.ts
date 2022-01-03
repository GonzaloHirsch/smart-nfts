import { EXTENSIONS, PARAMETER_TYPE, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class Correct {
    
    public static getExtensionOZImports(): string[] {
        return ["./node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol", "./node_modules/@openzeppelin/contracts/access/Ownable.sol", './node_modules/@openzeppelin/contracts/security/Pausable.sol'];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.CORRECT;
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
                visibility: VISIBILITY.PUBLIC,
                options: 'onlyOwner'
            },
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
}