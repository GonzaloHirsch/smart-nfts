import { EXCEPTION_NAMES } from "../constants/errors.constants";

class VerificationDuplicationException extends Error {
    constructor(address: string) {
        super(`Contract in address ${address} has already been verified.`);
        this.name = EXCEPTION_NAMES.VERIFICATION_DUPLICATION;
    }
}

export default VerificationDuplicationException;