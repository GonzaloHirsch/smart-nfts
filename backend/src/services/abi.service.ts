import { METHOD_TYPE } from "../constants/contract.constants";
import { IAbi, IAbiMethod } from "../interfaces/abi.interface";

class AbiService {

    private static instance: AbiService;

    constructor() {}

    static getInstance = () => {

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
