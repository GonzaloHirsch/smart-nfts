import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class InvalidContractOptionsException extends CustomException {
    constructor (id?: string) {
        super(`Options for contract ${id ? `with id ${id}`: ''} are invalid.`);
        this.name = EXCEPTION_NAMES.INVALID_CONTRACT_OPTIONS;
    }
}

export default InvalidContractOptionsException;
