import { METHOD_TYPE } from "../constants/contract.constants";
import { IAbi } from "../interfaces/abi.interface";

class AbiService {

    private static instance: AbiService;

    static getInstance = (): AbiService => {

        if (!AbiService.instance) {
            AbiService.instance = new AbiService();
        }
        return AbiService.instance;
    }

    static getContractFunction = (abi : IAbi) : IAbi => {
        return abi.filter(method => method.type === METHOD_TYPE.FUNCTION);
    }
}

export default AbiService;
