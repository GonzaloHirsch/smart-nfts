import { EXCEPTION_NAMES } from "../constants/errors.constants";

class BlockchainInteractException extends Error {
    constructor(blockchainMsg: string) {
        super(`Blockchian error when interacting:\n${blockchainMsg}`);
        this.name = EXCEPTION_NAMES.BLOCKCHAIN_INTERACT;
    }
}

export default BlockchainInteractException;