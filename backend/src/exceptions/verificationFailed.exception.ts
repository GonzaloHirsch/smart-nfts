import { EXCEPTION_NAMES } from "../constants/errors.constants";

class VerificationFailedException extends Error {
    constructor(address: string) {
        super(`Verification for contract with address ${address} failed.`);
        this.name = EXCEPTION_NAMES.VERIFICATION_FAILED;
    }
}

export default VerificationFailedException;