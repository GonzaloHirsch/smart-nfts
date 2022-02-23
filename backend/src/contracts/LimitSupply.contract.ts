import { EXTENSIONS, CONTRACT_TYPES, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';
import { IParameter } from "../interfaces/general.interface";

@staticImplements<IContractExtension>()
export abstract class LimitSupply {
    
    public static getExtensionOZImports(): string[] {
        return [];
    }
    public static getExtensionInputs(): IParameter[] {
        return [{
            name: 'maxSupply',
            type: CONTRACT_TYPES.UINT256
        }];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.LimitSupply;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [];
    }

    public static getExtensionVariables(): IContractVariable[] {
        return [{
            name: '_maxSupply',
            type: CONTRACT_TYPES.UINT256,
            visibility: VISIBILITY.PRIVATE
        }];
    }
    public static getExtensionConstructorContent(): string[] {
        return ['_maxSupply = %maxSupply%;'];
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
                content: ['require(_maxSupply < totalSupply(), \'Exceeding max token supply\');\n'],
                visibility: VISIBILITY.PUBLIC,
                options: ''
            },
        ];
    }    
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}