import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import { IStoredContract } from '../models/storedContract.model';
import Web3 from 'web3';
import { ropstenNetwork } from '../constants/general.constants';
import AbiService from './abi.service';

class InteractionService {
    private static instance: InteractionService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;

    constructor() {
        // Create web3 instance
        this.web3 = new Web3(new Web3.providers.HttpProvider(ropstenNetwork(process.env.INFURA_PROJECT_ID)));
    }

    static getInstance = () => {
        if (!InteractionService.instance) {
            InteractionService.instance = new InteractionService();
        }
        return InteractionService.instance;
    };

    handleMethodCall = async (
        contract: IStoredContract,
        methodId: string,
        params
    ): Promise<void> => {

        if (!contract.deployment || !contract.deployment.address) {
            throw new ContractNotDeployedException(contract.id);
        }

        const method = AbiService.getInstance().getContractMethod(contract.abi, methodId);
    

    }

    private _handleReadMethods = async (

    ): Promise<void> => {
        
    }

    private _handleWriteMethods = async (

    ): Promise<void> => {
        
    }
}

export default InteractionService;
