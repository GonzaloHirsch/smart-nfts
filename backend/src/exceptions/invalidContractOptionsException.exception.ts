import { EXCEPTION_NAMES } from "../constants/errors.constants";

class InvalidContractOptionsException extends Error {
    constructor (id: string) {
        super(`Options for contract with id ${id} are invalid.`);
        this.name = EXCEPTION_NAMES.INVALID_CONTRACT_OPTIONS;
    }
}

export default InvalidContractOptionsException;
