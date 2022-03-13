import { EXTENSIONS, CONTRACT_TYPES, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';
import { IParameter } from "../interfaces/general.interface";

@staticImplements<IContractExtension>()
export abstract class AutoIncrementIds {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/access/Ownable.sol", "@openzeppelin/contracts/utils/Counters.sol"];
    }
    public static getExtensionInputs(): IParameter[] {
        return [];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.AutoIncrementIds;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [{
            name: 'Counters',
            for: 'Counters.Counter'
        }];
    }    
    public static getExtensionVariables(): IContractVariable[] {
        return [{
            name: '_tokenIdCounter',
            type: 'Counters.Counter',
            visibility: VISIBILITY.PRIVATE
        }];
    }
    public static getExtensionConstructorContent(): string[] {
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
            ],
            mandatory: true,
            content: ['uint256 tokenId = _tokenIdCounter.current();\n', '_tokenIdCounter.increment();\n', '_safeMint(to, tokenId);\n'],
            visibility: VISIBILITY.PUBLIC,
            options: 'onlyOwner'
        }];
    }
    public static getParentExtension(): EXTENSIONS | null {
        return EXTENSIONS.Mintable;
    }    
}