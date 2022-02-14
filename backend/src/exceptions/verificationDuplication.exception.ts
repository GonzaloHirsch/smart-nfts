import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class VerificationDuplicationException extends CustomException {
    constructor(address: string) {
        super(`Contract in address ${address} has already been verified.`);
        this.name = EXCEPTION_NAMES.VERIFICATION_DUPLICATION;
    }
}

export default VerificationDuplicationException;