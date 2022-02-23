import { EXTENSIONS, CONTRACT_TYPES, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';
import { IParameter } from "../interfaces/general.interface";

@staticImplements<IContractExtension>()
export abstract class UniqueStorage {
    
    public static getExtensionOZImports(): string[] {
        return [];
    }
    public static getExtensionInputs(): IParameter[] {
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
    public static getExtensionConstructorContent(): string[] {
        return [];
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