import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class RecaptchaVerificationFailedException extends CustomException {
    constructor() {
        super(`Recaptcha verification failed`);
        this.name = EXCEPTION_NAMES.RECAPTCHA_VERIFICATION_FAILED;
    }
}

export default RecaptchaVerificationFailedException;