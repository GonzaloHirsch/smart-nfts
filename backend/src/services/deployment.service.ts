import { compileContract, flattenContract } from '../helpers/compiler.helper';
import { IStoredContract } from '../models/storedContract.model';
import Web3 from 'web3';
import { ropstenNetwork, deployGas, gasPrice } from '../constants/general.constants';
import InsufficientGasException from '../exceptions/insufficientGas.exception';

class DeploymentService {
    private static instance: DeploymentService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;

    constructor() {
        // Create web3 instance
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

        const tx = await this._createTransaction(contractData, deployGas);

        return await this._signAndSendTransaction(tx, true);
    };

    private async _createTransaction(data: string, gasLimit: number) {
        const nonce = await this.web3.eth.getTransactionCount(this.deploymentAddress!);

        const gasPriceHex = this.web3.utils.toHex(this.web3.utils.toWei(gasPrice, 'gwei'));
        const gasLimitHex = this.web3.utils.toHex(gasLimit);

        const tx = {
            nonce: this.web3.utils.toHex(nonce),
            gasPrice: gasPriceHex,
            gas: gasLimitHex,
            from: this.deploymentAddress,
            // No to: because we are deploying a contract
            value: 0,
            data: data
        };

        return tx;
    }

    private async _signAndSendTransaction(tx: any, isDeploy = false): Promise<string | void | undefined> {
        const signPromise = this.web3.eth.accounts.signTransaction(tx, process.env.DEPLOYMENT_PRIVATE_KEY!);

        return signPromise
        .then((signedTx) => {
            const sentTx = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction!);
            return sentTx;
        })
        .then((receipt) => {
            if (isDeploy) {
            return receipt.contractAddress;
            }
        })
        .catch((err) => {
            throw new InsufficientGasException(this.deploymentAddress);
        });
    }
}

export default DeploymentService;
