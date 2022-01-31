import { EXCEPTION_NAMES } from "../constants/errors.constants";

class CompilationException extends Error {
    constructor() {
        super('Compilation failed. Contract contains errors.');
        this.name = EXCEPTION_NAMES.COMPILATION_ERROR;
    }
}

export default CompilationException;