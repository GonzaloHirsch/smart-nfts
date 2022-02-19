import { EXTENSIONS, CONTRACT_TYPES, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class UniqueStorage {
    
    public static getExtensionOZImports(): string[] {
        return [];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.UniqueStorage;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [];
    }

    public static getExtensionVariables(): IContractVariable[] {
        return [{
            name: '_hashExists',
            type: 'mapping(string => bool)',
            visibility: VISIBILITY.PRIVATE
        }];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [
            {
                name: 'safeMint',
                params: [{
                    name: 'hash',
                    type: CONTRACT_TYPES.STRING_MEMORY
                }],
                mandatory: false,
                content: ['require(!_hashExists[hash], \'Minting an exisiting hash\');\n','_hashExists[hash] = true;\n'],
                visibility: VISIBILITY.PUBLIC,
                options: ''
            },
        ];
    }    
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}