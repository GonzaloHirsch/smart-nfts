import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class InsufficientGasException extends CustomException {
    constructor(address: string) {
        super(`Insufficient gas in address ${address}`);
        this.name = EXCEPTION_NAMES.INSUFFICIENT_GAS;
    }
}

export default InsufficientGasException;