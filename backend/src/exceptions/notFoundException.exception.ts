import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class NotFoundException extends CustomException {
    private constructor (msg: string) {
        super(msg);
    }

    static Contract (id: string) {
        const exception = new NotFoundException(`Contract with id ${id} not found.`);
        exception.name = EXCEPTION_NAMES.CONTRACT_NOT_FOUND;
        return exception;
    }

    static Method (id: string) {
        const exception = new NotFoundException(`Method with id ${id} not found.`);
        exception.name = EXCEPTION_NAMES.METHOD_NOT_FOUND;
        return exception;
    }
}

export default NotFoundException;
