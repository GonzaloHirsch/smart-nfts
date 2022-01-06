import { EXTENSIONS, PARAMETER_TYPE, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import {staticImplements} from '../helpers/global.helper';

@staticImplements<IContractExtension>()
export abstract class ERC721 {
    
    public static getExtensionOZImports(): string[] {
        return ["@openzeppelin/contracts/token/ERC721/ERC721.sol"];
    }
    public static getExtensionName(): EXTENSIONS {
        return EXTENSIONS.ERC721;
    }
    public static getExtensionLibs(): IContractLibrary[] {
        return [{
            name: 'Counters',
            for: 'Counter.Counters'
        }];
    }
    public static getExtensionVariables(): IContractVariable[] {
        return [{
            type: PARAMETER_TYPE.ADDRESS,
            visibility: VISIBILITY.PRIVATE,
            name: '_tokenId'
        }];
    }
    public static getExtensionMethods(): IContractMethod[] {
        return [{
            name: 'hello',
            params: [{
                name: 'to',
                type: PARAMETER_TYPE.ADDRESS
            }],
            mandatory: true,
            content: ['this is the first line;\n', 'this is the second line;\n'],
            visibility: VISIBILITY.EXTERNAL,
            stateMutability: STATE_MUTABILITY.NONPAYABLE
        }];
    }
    public static getParentExtension(): EXTENSIONS | null {
        return null;
    }    
}