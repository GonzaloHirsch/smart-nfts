import { compileContract } from '../helpers/compiler.helper';
import { IStoredContract } from '../models/storedContract.model';
import Web3 from 'web3';
import { ropstenNetwork, rinkebyNetwork, DEPLOY_GAS } from '../constants/general.constants';
import TransactionService from './transaction.service';
import { SUPPORTED_NETWORKS } from '../constants/contract.constants';
import NoNetworkException from '../exceptions/noNetwork.exception';

class DeploymentService {
    private static instance: DeploymentService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;
    private transactionService;

    // This service should use the env.var. for the network
    constructor() {
        // Create web3 instance using the process env
        this.transactionService = TransactionService.getInstance(process.env.DEPLOYMENT_NETWORK!);
        this.web3 = new Web3(new Web3.providers.HttpProvider(TransactionService.getNetwork(process.env.DEPLOYMENT_NETWORK!)!));
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
    public deployContract = async (contract: IStoredContract, contractString: string): Promise<IStoredContract> => {
        let contractAddress;

        // Compile contract
        const compiledContract = compileContract(contractString);

        // Deploy contract
        contractAddress = await this._deployCompiledContract(compiledContract.abi, compiledContract.bytecode);

        // Update inner state
        contract.abi = compiledContract.abi;
        contract.deployment.network = process.env.DEPLOYMENT_NETWORK as SUPPORTED_NETWORKS;
        contract.deployment.address = contractAddress!;
        contract.deployment.date = new Date();
        contract.deployment.compilerVersion = compiledContract.compilerVersion;
        contract.markModified('deployment');
        contract.markModified('abi');
        await contract.save();

        return contract;
    };

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

        const tx = await this.transactionService.createTransaction(contractData, DEPLOY_GAS, this.deploymentAddress);

        return await this.transactionService.signAndSendTransaction(tx, true);
    };
}

export default DeploymentService;
