import { EXCEPTION_NAMES } from "../constants/errors.constants";

class InvalidInputException extends Error {

    private constructor (msg: string) {
        super(msg);
    }
    
    static Missing(inputName: string, inputType: string) {
        const msg = `Input (${inputName}: ${inputType}) is missing.`;
        const exception = new InvalidInputException(msg);
        exception.name = EXCEPTION_NAMES.INVALID_INPUT_MISSING;
        return exception;
    }

    static Type(inputName: string, inputType: string, inputValue: any) {
        const msg = `Input (${inputValue}) is invalid for param (${inputName}: ${inputType}).`;
        const exception = new InvalidInputException(msg);
        exception.name = EXCEPTION_NAMES.INVALID_INPUT_TYPE;
        return exception;
    }

    static Count(expected: number, received: number) {
        const msg = `Invalid number of parameters. Got ${received} expected ${expected}!`;
        const exception = new InvalidInputException(msg);
        exception.name = EXCEPTION_NAMES.INVALID_INPUT_COUNT;
        return exception;
    }
}

export default InvalidInputException;