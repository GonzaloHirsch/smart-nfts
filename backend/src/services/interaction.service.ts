import Web3 from 'web3';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { ropstenNetwork } from '../constants/general.constants';
import { IArguments } from '../interfaces/general.interface';
import { IAbiInput } from '../interfaces/abi.interface';
import { IAbiMethod } from '../interfaces/abi.interface';
import { STATE_MUTABILITY } from '../constants/contract.constants';
import { typeValidations } from '../helpers/validations.helper';
// Services
import TransactionService from './transaction.service';
import AbiService from './abi.service';
// Exceptions
import MethodInputException from '../exceptions/methodInput.exception';
import BlockchainInteractException from '../exceptions/blockchainInteract.exception';
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';


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
        // Address of the deployed contract
        const address = storedContract.deployment.address;

        // Get the method definition from the ABI
        const method = AbiService.getInstance().getContractMethod(storedContract.abi, methodId);
    
        // Check the arguments match the inputs of the methods
        this._checkValidInputs(method.inputs, args);

        // Get the web3 Contract
        const contract = new this.web3.eth.Contract(storedContract.abi as any, address);

        // Different calls for read and write methods
        return this._isReadMethod(method)
            ? this._handleReadMethod(contract, method, args)
            : this._handleWriteMethod(contract, address, method, args);
    }

    private _checkValidInputs = (methodInputs: IAbiInput[], args: IArguments): void => {
        
        for (const inputDef of methodInputs) {      
            
            const argumentValue = args[inputDef.name]; 
            const typeValidator = typeValidations[inputDef.type];

            console.log(argumentValue, typeValidator)
            if (argumentValue == null) {
                throw new MethodInputException(inputDef.name, inputDef.type);
            }

            if (typeValidator == null || !typeValidator(argumentValue)) {
                console.log('INVALID  PARAM TYPE')
                throw new MethodInputException(inputDef.name, inputDef.type, argumentValue);
            }
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

        return await contract.methods[method.name!](...argsValues)
            .call({from: this.deploymentAddress})
            .catch((err: any) => {
                console.log(err);
                throw new BlockchainInteractException(err.message);
            });
    }

    private _handleWriteMethod = async (
        contract: any, contractAddress: string, method: IAbiMethod, args: IArguments
    ): Promise<any> => {

        const argsValues = Object.values(args);

        const data = contract.methods[method.name!](...argsValues).encodeABI();
            
        // TODO - gas fees
        const tx = await TransactionService.getInstance().createTransaction(
            data, 300000, this.deploymentAddress, contractAddress
        );

        return await TransactionService.getInstance().signAndSendTransaction(tx);

    }
}

export default InteractionService;
