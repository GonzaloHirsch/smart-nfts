import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class CompilationException extends CustomException {
    constructor() {
        super('Compilation failed. Contract contains errors.');
        this.name = EXCEPTION_NAMES.COMPILATION_ERROR;
    }
}

export default CompilationException;