import { ERC721 } from "../contracts/ERC721.contract";
import { Burnable } from "../contracts/Burnable.contract";
import { Pausable } from "../contracts/Pausable.contract";
import { IContractExtension } from "../interfaces/contract.interface";
import { AutoIncrementIds } from "../contracts/AutoIncrementIds.contract";
import { Mintable } from "../contracts/Mintable.contract";
import { URIStorage } from "../contracts/URIStorage.contract";
import { Enumerable } from "../contracts/Enumerable.contract";
import { UniqueStorage } from "../contracts/UniqueStorage.contract";
import { LimitSupply } from "../contracts/LimitSupply.contract";

export const SOLIDITY_VERSION = '0.8.2';
export const CONTRACT_LICENSE = 'MIT';

export enum STATE_MUTABILITY {
    PURE = 'pure',
    VIEW = 'view',
    NONPAYABLE = 'nonpayable',
    NONPAYABLE_EMPTY = '',
    PAYABLE = 'payable'
};

export enum METHOD_TYPE {
    FUNCTION = 'function',
    EVENT = 'event',
    CONSTRUCTOR = 'constructor'
}

export enum CONTRACT_TYPES {
    ADDRESS = 'address',
    STRING_MEMORY = 'string memory',
    UINT256 = 'uint256',
    UINT256_ARRAY = 'uint256[]',
    BOOL = 'bool',
    STRING = 'string',
    BYTES = 'bytes',
    BYTES4 = 'bytes4',
    TRANSACTION_HASH = 'transactionHash',
}

export enum VISIBILITY {
    INTERNAL = 'internal', // only inside contract that inherits an internal function
    EXTERNAL = 'external', // only other contracts and accounts can call
    PRIVATE = 'private',   // only inside the contract that defines the function
    PUBLIC = 'public',     // any contract and account can call
}

export enum EXTENSIONS {
    ERC721 = 'ERC721',
    ERC721URIStorage = 'ERC721URIStorage',
    ERC721Burnable = 'ERC721Burnable',
    ERC721Enumerable = 'ERC721Enumerable',
    Pausable = 'Pausable',
    Mintable = 'Mintable',
    AutoIncrementIds = 'AutoIncrementIds',
    Ownable = 'Ownable',
    UniqueStorage = 'UniqueStorage',
    LimitSupply = 'LimitSupply',
}

export enum FINAL_EXTENSIONS {
    ERC721 = 'ERC721',
    ERC721URIStorage = 'ERC721URIStorage',
    ERC721Burnable = 'ERC721Burnable',
    ERC721Enumerable = 'ERC721Enumerable',
    Pausable = 'Pausable',
    Ownable = 'Ownable',
}

export const EXTENSION_MAP: Map<string, IContractExtension> = new Map([
    [EXTENSIONS.ERC721, ERC721], 
    [EXTENSIONS.ERC721Burnable, Burnable],
    [EXTENSIONS.Pausable, Pausable],    
    [EXTENSIONS.Mintable, Mintable],    
    [EXTENSIONS.AutoIncrementIds, AutoIncrementIds],
    [EXTENSIONS.ERC721URIStorage, URIStorage],
    [EXTENSIONS.ERC721Enumerable, Enumerable],
    [EXTENSIONS.UniqueStorage, UniqueStorage],
    [EXTENSIONS.LimitSupply, LimitSupply],
]);

export const REQUIRE_KEYWORD = 'require';

export enum SUPPORTED_NETWORKS {
    RINKEBY = 'rinkeby',
    ROPSTEN = 'ropsten'
};

export enum UPDATE_TYPES {
    CONTRACT = 'CONTRACT',
    METADATA = 'METADATA',
    ALL = 'ALL',
}