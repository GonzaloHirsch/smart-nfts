import { EXTENSIONS, STATE_MUTABILITY, VISIBILITY } from "../constants/contract.constants";

export const getMergedMethodVisibility = (visibilities: (VISIBILITY | undefined)[]): VISIBILITY => {
    // The default visibility is public
    if (visibilities.includes(undefined)) return VISIBILITY.PUBLIC;
    // Can be called from all potential parties
    else if (visibilities.includes(VISIBILITY.PUBLIC)) return VISIBILITY.PUBLIC;   
    // Can only be called from a third party. It cannot be called from the main contract itself or any contracts derived from it.          
    else if (visibilities.includes(VISIBILITY.EXTERNAL)) return VISIBILITY.EXTERNAL;
    // Can be called by the main contract itself, plus any derived contracts
    else if (visibilities.includes(VISIBILITY.INTERNAL)) return VISIBILITY.INTERNAL;
    // Can only be called by the main contract itself
    else return VISIBILITY.PRIVATE;
}

export const getMergedMethodStateMutability = (mutabilities: (STATE_MUTABILITY | undefined)[]): STATE_MUTABILITY => {
    // Must take ether for it to work
    if (mutabilities.includes(STATE_MUTABILITY.PAYABLE)) return STATE_MUTABILITY.PAYABLE;
    // Default mutability is non payable
    else if (mutabilities.includes(undefined)) return STATE_MUTABILITY.NONPAYABLE;
    // Cannot take any ether
    else if (mutabilities.includes(STATE_MUTABILITY.NONPAYABLE)) return STATE_MUTABILITY.NONPAYABLE;
    // Only reads and does not modify the state
    else if (mutabilities.includes(STATE_MUTABILITY.VIEW)) return STATE_MUTABILITY.VIEW;
    // Does not modify or read from the state
    else return STATE_MUTABILITY.PURE;
}

export const getExtensionAdditions = (extensions: EXTENSIONS[]): EXTENSIONS[] => {
    if (extensions.includes(EXTENSIONS.Mintable) || extensions.includes(EXTENSIONS.Pausable)) {
        extensions.push(EXTENSIONS.Ownable);
    }
    return extensions;
}
