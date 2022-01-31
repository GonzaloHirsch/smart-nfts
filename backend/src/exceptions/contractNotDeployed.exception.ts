import { EXCEPTION_NAMES } from "../constants/errors.constants";

class ContractNotDeployedException extends Error {
    constructor (id: string) {
        super(`Contract with id ${id} has not been deployed yet.`);
        this.name = EXCEPTION_NAMES.CONTRACT_NOT_DEPLOYED;
    }
}

export default ContractNotDeployedException;
