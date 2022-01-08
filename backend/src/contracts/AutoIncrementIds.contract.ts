import { EXTENSIONS, PARAMETER_TYPE, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class AutoIncrementIds {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/access/Ownable.sol", "@openzeppelin/contracts/utils/Counters.sol"];
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
    public static getExtensionMethods(): IContractMethod[] {
        return [{
            name: 'safeMint',
            params: [
                {
                    name: 'to',
                    type: PARAMETER_TYPE.ADDRESS
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