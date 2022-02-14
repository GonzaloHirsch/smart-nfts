import { EXCEPTION_NAMES } from "../constants/errors.constants";

class BlockchainInteractException extends Error {
    public receipt: any;
    constructor(blockchainMsg: string, receipt?: any) {
        super(`Blockchain error when interacting:\n${blockchainMsg}`);
        this.name = EXCEPTION_NAMES.BLOCKCHAIN_INTERACT;
        if (receipt != null) {
            this.receipt = receipt;
        }
    }
}

export default BlockchainInteractException;