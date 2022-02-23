import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class MissingHeaderException extends CustomException {
    constructor (name: string) {
        super(`Missing or invalid header '${name}' in request.`);
        this.name = EXCEPTION_NAMES.MISSING_HEADER;
    }
}

export default MissingHeaderException;
