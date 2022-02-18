import Web3 from 'web3';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { IInteractResponse } from '../interfaces/blockchain.interface';
import { IArguments } from '../interfaces/general.interface';
import { IAbiInput } from '../interfaces/abi.interface';
import { IAbiMethod } from '../interfaces/abi.interface';
import { CONTRACT_TYPES, STATE_MUTABILITY } from '../constants/contract.constants';
import { MINT_GAS } from '../constants/general.constants';
import { typeValidations } from '../helpers/validations.helper';
// Services
import TransactionService from './transaction.service';
import AbiService from './abi.service';
// Exceptions
import BlockchainInteractException from '../exceptions/blockchainInteract.exception';
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import InvalidInputException from '../exceptions/invalidInput.exception';

class InteractionService {
    private static instance: InteractionService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;

    constructor(network: string) {
        // Create web3 instance
        this.web3 = new Web3(new Web3.providers.HttpProvider(TransactionService.getNetwork(network)!));
    }

    static getInstance = (network: string) => {
        if (!InteractionService.instance) {
            InteractionService.instance = new InteractionService(network);
        }
        return InteractionService.instance;
    };

    handleMethodCall = async (
        storedContract: IStoredContract, methodId: string, args: IArguments
    ): Promise<IInteractResponse> => {

        if (!storedContract.deployment || !storedContract.deployment.address) {
            throw new ContractNotDeployedException(storedContract.id);
        }
        // Address of the deployed contract
        const address = storedContract.deployment.address;

        // Get the method definition from the ABI
        const method = AbiService.getInstance().getContractMethod(storedContract.deployment.abi, methodId);

        // Check the arguments match the inputs of the methods
        this._checkValidInputs(method.inputs, args);

        // Get the web3 Contract
        const contract = new this.web3.eth.Contract(storedContract.deployment.abi as any, address);

        // Different calls for read and write methods
        return this._isReadMethod(method) 
            ? this._handleReadMethod(contract, method, args) 
            : this._handleWriteMethod(storedContract.deployment.network, contract, address, method, args);
    };

    private _checkValidInputs = (methodInputs: IAbiInput[], args: IArguments): void => {
        
        if (methodInputs.length !== Object.keys(args).length) {
            throw InvalidInputException.Count(methodInputs.length, Object.keys(args).length);
        }
        
        for (const inputDef of methodInputs) {
            const argumentValue = args[inputDef.name];
            const typeValidator = typeValidations[inputDef.type];

            if (argumentValue == null) {
                throw InvalidInputException.Missing(inputDef.name, inputDef.type);
            }

            if (typeValidator == null || !typeValidator(argumentValue)) {
                throw InvalidInputException.Type(inputDef.name, inputDef.type, argumentValue);
            }
        }
    };

    private _isReadMethod = (method: IAbiMethod): boolean => {
        return method.stateMutability === STATE_MUTABILITY.PURE || method.stateMutability === STATE_MUTABILITY.VIEW;
    };

    private _handleReadMethod = async (contract: any, method: IAbiMethod, args: IArguments): Promise<IInteractResponse> => {
        const argsValues = Object.values(args);

        const returnType = method.outputs.length === 1
            ? method.outputs[0].type as CONTRACT_TYPES
            : method.outputs.map(o => o.type as CONTRACT_TYPES);

        const result = await contract.methods[method.name!](...argsValues)
            .call({ from: this.deploymentAddress })
            .catch((err: any) => {
                console.log(err);
                throw new BlockchainInteractException(err.message);
            });

        return {
            result: result,
            resultType: returnType
        }
    };

    private _handleWriteMethod = async (
        network: string, 
        contract: any, 
        contractAddress: string, 
        method: IAbiMethod, 
        args: IArguments
    ): Promise<IInteractResponse> => {

        const argsValues = Object.values(args);

        const instance = TransactionService.getInstance(network);

        const data = contract.methods[method.name!](...argsValues).encodeABI();

        // TODO - gas fees
        const tx = await instance.createTransaction(data, MINT_GAS, this.deploymentAddress, contractAddress);

        const transactionHash = await instance.signAndSendTransaction(tx);

        return {
            result: transactionHash,
            resultType: CONTRACT_TYPES.TRANSACTION_HASH
        };
    };
}

export default InteractionService;
