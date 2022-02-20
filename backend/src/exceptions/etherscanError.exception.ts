import { EXCEPTION_NAMES } from "../constants/errors.constants";
import CustomException from "./custom.exception";

class EtherscanErrorException extends CustomException {
    constructor() {
        super('Error in Etherscan API call.');
        this.name = EXCEPTION_NAMES.ETHERSCAN_ERROR;
    }
}

export default EtherscanErrorException;