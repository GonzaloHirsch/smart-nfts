import { EXCEPTION_NAMES } from "../constants/errors.constants";

class NoNetworkException extends Error {
    constructor (config: string | undefined) {
        super(`No supported network selected, current selection is ${config}`);
        this.name = EXCEPTION_NAMES.CONTRACT_NOT_DEPLOYED;
    }
}

export default NoNetworkException;
