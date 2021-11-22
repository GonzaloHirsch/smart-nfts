import { EXTENSIONS } from "../constants/contract.constants";

class CreationService {

    private static instance: CreationService;

    constructor() {}

    static getInstance = () => {

        if (!CreationService.instance) {
            CreationService.instance = new CreationService();
        }
        return CreationService.instance;
    }

    saveContract = async () => {

    }

    genContract = (options: EXTENSIONS[]) : string => {

        return 'This is hard :(';
    };

    private genContractVariables = (options: EXTENSIONS[]) => {

    };

    private genContractMethods = (options: EXTENSIONS[]) => {

    };
}

export default CreationService;
