import { compileContract } from '../helpers/compiler.helper';
import { IStoredContract } from '../models/storedContract.model';
import Web3 from 'web3';
import { ropstenNetwork, DEPLOY_GAS, NULL_ADDRESS } from '../constants/general.constants';
import TransactionService from './transaction.service';

class DeploymentService {
    private static instance: DeploymentService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;
    private transactionService;

    constructor() {
        // Create web3 instance
        this.transactionService = TransactionService.getInstance();
        this.web3 = new Web3(new Web3.providers.HttpProvider(ropstenNetwork(process.env.INFURA_PROJECT_ID)));
    }

    static getInstance = () => {
        if (!DeploymentService.instance) {
            DeploymentService.instance = new DeploymentService();
        }
        return DeploymentService.instance;
    };

    /**
     * Given the stored contract and its string content, compile the contract content
     * and deploy to the ethereum blockchain. Save the state of the contract in local db.
     * @param contract Contract info that is stored in the our own db
     * @param contractString Content of the contract that must be compiled
     */
    public deployContract = async (
        contract: IStoredContract, 
        contractString: string
    ) : Promise<IStoredContract> => {
        
        let contractAddress;

        // Compile contract
        const compiledContract = compileContract(contractString);

        // Deploy contract
        contractAddress = await this._deployCompiledContract(compiledContract.abi, compiledContract.bytecode);
        
        // Update inner state
        contract.abi = compiledContract.abi;
        contract.deployment.address = contractAddress!;
        contract.deployment.date = new Date();
        contract.deployment.compilerVersion = compiledContract.compilerVersion;
        contract.markModified('deployment');
        await contract.save();

        return contract;
    }

    /**
     * Given the abi and bytecode of the contract, deploys the contract to the ehtereum
     * blockchain using the Web3 library.
     * @param abi 
     * @param bytecode 
     */
    private _deployCompiledContract = async (abi: any, bytecode: string): Promise<string | void | undefined> => {
        // Create contract instance
        const contract = new this.web3.eth.Contract(abi);
        // Deploy the contract w/promise
        const contractData = await contract
        .deploy({
            data: bytecode
        })
        .encodeABI();

        const tx = await this.transactionService.createTransaction(
            NULL_ADDRESS, 
            this.deploymentAddress,
            contractData, 
            DEPLOY_GAS
        );

        return await this.transactionService.signAndSendTransaction(tx, true);
    };
}

export default DeploymentService;
