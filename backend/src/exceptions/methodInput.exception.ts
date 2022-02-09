import { EXCEPTION_NAMES } from "../constants/errors.constants";

class MethodInputException extends Error {
    constructor(inputName: string, inputType: string, inputValue: any = undefined) {
        const msg = inputValue != null 
            ? `Input (${inputValue}) is invalid for param (${inputName}: ${inputType}).`
            : `Input (${inputName}: ${inputType}) is missing.`
        super(msg);
        this.name = EXCEPTION_NAMES.METHOD_INPUT_ERROR;
    }
}

export default MethodInputException;