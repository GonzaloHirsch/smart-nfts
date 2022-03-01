import { compileContract } from '../helpers/compiler.helper';
import { IStoredContract } from '../models/storedContract.model';
import Web3 from 'web3';
import { DEPLOY_GAS } from '../constants/general.constants';
import TransactionService from './transaction.service';
import { SUPPORTED_NETWORKS } from '../constants/contract.constants';
import ContractNotCompiledException from 'src/exceptions/contractNotCompiled.exception';

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
     * Given the stored contract and its string content
     * deploy to the ethereum blockchain. Save the state of the contract in local db.
     * @param contract Contract info that is stored in the our own db
     * @param contractString Content of the contract that must be compiled
     */
    public deployContract = async (contract: IStoredContract): Promise<IStoredContract> => {
        let contractAddress;
        
        // Deploy contract
        contractAddress = await this._deployCompiledContract(contract.compilation!.abi, contract.compilation!.bytecode);
        
        console.log(`Deployed contract ${contract.id}`);

        // Update inner state
        contract.deployment.digest = contract.digest;
        contract.deployment.abi = [...contract.compilation!.abi];
        contract.deployment.extensions = [...contract.compilation!.extensions];
        contract.deployment.inputs = {...contract.compilation!.inputs};
        contract.deployment.network = process.env.DEPLOYMENT_NETWORK as SUPPORTED_NETWORKS;
        contract.deployment.address = contractAddress!;
        contract.deployment.date = new Date();
        contract.deployment.compilerVersion = contract.compilation!.compilerVersion;
        contract.markModified('deployment');
        contract.markModified('deployment.abi');
        contract.markModified('deployment.extensions');
        contract.markModified('deployment.inputs');
        contract.compilation = undefined;
        contract.markModified('compilation');
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

        console.log("Created deploy transaction");
        const tx = await this.transactionService.createTransaction(contractData, DEPLOY_GAS, this.deploymentAddress);
        console.log("Started deploy transaction");

        return await this.transactionService.signAndSendTransaction(tx, true);
    };
}

export default DeploymentService;
