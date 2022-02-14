import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class MissingExtensionException extends CustomException {
    constructor(extension: string) {
        super(`Extension ${extension} does not exist in the extension map.`);
        this.name = EXCEPTION_NAMES.MISSING_EXTENSION;
    }
}

export default MissingExtensionException;