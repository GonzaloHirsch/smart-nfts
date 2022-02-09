import { arrayGetFirstMatch } from "../helpers/collection.helper";
import { METHOD_TYPE } from "../constants/contract.constants";
import { IAbi, IAbiMethod } from "../interfaces/abi.interface";

class AbiService {

    private static instance: AbiService;

    static getInstance = () => {

        if (!AbiService.instance) {
            AbiService.instance = new AbiService();
        }
        return AbiService.instance;
    }

    getContractFunction = (abi : IAbi) : IAbi => {
        return abi.filter(method => method.type === METHOD_TYPE.FUNCTION);
    }

    getContractMethod = (abi: IAbi, methodId: string): IAbiMethod => {
        const method = arrayGetFirstMatch(
            abi, 
            (abiMethod: IAbiMethod) => abiMethod._id.toString() === methodId
        );

        if (method == null) {
            throw new Error('TODO');
        }

        return method;
    }
}

export default AbiService;
