
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
    ADDRESS = 'address'
}

export enum VISIBILITY {
    INTERNAL = 'internal', // only inside contract that inherits an internal function
    EXTERNAL = 'external', // only other contracts and accounts can call
    PRIVATE = 'private',   // only inside the contract that defines the function
    PUBLIC = 'public',     // any contract and account can call
}