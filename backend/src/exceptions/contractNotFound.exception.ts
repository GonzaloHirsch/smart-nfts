import { EXCEPTION_NAMES } from "../constants/errors.constants";

class ContractNotFoundException extends Error {
    constructor (id: string) {
        super(`Contract with id ${id} not found.`);
        this.name = EXCEPTION_NAMES.CONTRACT_NOT_FOUND;
    }
}

export default ContractNotFoundException;
