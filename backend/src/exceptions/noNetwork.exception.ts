import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class NoNetworkException extends CustomException {
    constructor (config: string | undefined) {
        super(`No supported network selected, current selection is ${config}`);
        this.name = EXCEPTION_NAMES.NO_NETWORK;
    }
}

export default NoNetworkException;