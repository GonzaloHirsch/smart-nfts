import { ERC721 } from "../contracts/ERC721.contract";
import { Burnable } from "../contracts/Burnable.contract";
import { Pausable } from "../contracts/Pausable.contract";
import { IContractExtension } from "../interfaces/contract.interface";

export const SOLIDITY_VERSION = '0.8.2';
export const CONTRACT_LICENSE = 'MIT';

export const EXTENSION_MAP: Map<string, IContractExtension> = new Map([
    ['ERC721', ERC721], 
    ['Burnable', Burnable],
    ['Pausable', Pausable],    
]);

export enum STATE_MUTABILITY {
    PURE = 'pure',
    VIEW = 'view',
    NONPAYABLE = 'nonpayable',
    PAYABLE = 'payable'
};

export enum METHOD_TYPE {
    FUNCTION = 'function',
    EVENT = 'event'
}

export enum PARAMETER_TYPE {
    ADDRESS = 'address',
    STRING_MEMORY = 'string memory',
    UINT256 = 'uint256',
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
    CORRECT = 'Pausable, Ownable'
}