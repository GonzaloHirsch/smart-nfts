import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class BlockchainInteractException extends CustomException {
    constructor(blockchainMsg: string, receipt?: any) {
        super(`Blockchain error when interacting: ${blockchainMsg}`, receipt);
        this.name = EXCEPTION_NAMES.BLOCKCHAIN_INTERACT;
    }
}

export default BlockchainInteractException;