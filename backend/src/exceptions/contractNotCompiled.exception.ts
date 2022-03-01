import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class ContractNotCompiledException extends CustomException {
    constructor (id: string) {
        super(`Contract with id ${id} has not been compiled yet.`);
        this.name = EXCEPTION_NAMES.CONTRACT_NOT_DEPLOYED;
    }
}

export default ContractNotCompiledException;
