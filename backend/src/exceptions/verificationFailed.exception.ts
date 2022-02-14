import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class VerificationFailedException extends CustomException {
    constructor(address: string) {
        super(`Verification for contract with address ${address} failed.`);
        this.name = EXCEPTION_NAMES.VERIFICATION_FAILED;
    }
}

export default VerificationFailedException;