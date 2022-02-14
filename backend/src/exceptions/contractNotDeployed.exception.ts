import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class ContractNotDeployedException extends CustomException {
    constructor (id: string) {
        super(`Contract with id ${id} has not been deployed yet.`);
        this.name = EXCEPTION_NAMES.CONTRACT_NOT_DEPLOYED;
    }
}

export default ContractNotDeployedException;
