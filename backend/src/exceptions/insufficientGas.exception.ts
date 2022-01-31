import { EXCEPTION_NAMES } from "../constants/errors.constants";

class InsufficientGasException extends Error {
    constructor(address: string) {
        super(`Insufficient gas in address ${address}`);
        this.name = EXCEPTION_NAMES.INSUFFICIENT_GAS;
    }
}

export default InsufficientGasException;