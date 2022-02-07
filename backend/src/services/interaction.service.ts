import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import { IStoredContract } from '../models/storedContract.model';
import Web3 from 'web3';
import { ropstenNetwork } from '../constants/general.constants';
import AbiService from './abi.service';
import { IArguments } from '../interfaces/general.interface';
import { IAbiInput } from '../interfaces/abi.interface';
import { IAbiMethod } from '../interfaces/abi.interface';
import { STATE_MUTABILITY } from '../constants/contract.constants';
import TransactionService from './transaction.service';

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
        storedContract: IStoredContract,
        methodId: string,
        args: IArguments,
    ): Promise<void> => {

        if (!storedContract.deployment || !storedContract.deployment.address) {
            throw new ContractNotDeployedException(storedContract.id);
        }

        // Get the method definition from the ABI
        const method = AbiService.getInstance().getContractMethod(storedContract.abi, methodId);
    
        // Check the arguments match the inputs of the methods
        this._checkValidInputs(method.inputs, args);

        // Get the web3 Contract
        const contract = new this.web3.eth.Contract(storedContract.abi as any, storedContract.deployment.address);

        // Different calls for read and write methods
        return this._isReadMethod(method)
            ? this._handleReadMethod(contract, method, args)
            : this._handleWriteMethod(contract, method, args);
    }

    private _checkValidInputs = (methodInputs: IAbiInput[], args: IArguments): void => {
        
        for (const input of methodInputs) {      

            const argumentValue = args[input.name]; 

            if (argumentValue == null) {
                // TODO - MISSING PARAM ERROR
            }
            
            // TODO - Validar que sea el tipo correcto (Gonza validations) -> sino error
        }
    }

    private _isReadMethod = (method: IAbiMethod): boolean => {
        return method.stateMutability === STATE_MUTABILITY.PURE 
            || method.stateMutability === STATE_MUTABILITY.VIEW;
    }

    private _handleReadMethod = async (
        contract: any, method: IAbiMethod, args: IArguments
    ): Promise<any> => {

        const argsValues = Object.values(args);

        return await contract.methods[method.name!](...argsValues).call({from: this.deploymentAddress});
    }

    private _handleWriteMethod = async (
        contract: any, method: IAbiMethod, args: IArguments
    ): Promise<any> => {

        const argsValues = Object.values(args);

        const data = contract.methods[method.name!](argsValues).encodeABI();
            
        // TODO - gas fees
        const tx = await TransactionService.getInstance().createTransaction(
            data, 30000, this.deploymentAddress
        );

        return await TransactionService.getInstance().signAndSendTransaction(tx);

    }
}

export default InteractionService;
