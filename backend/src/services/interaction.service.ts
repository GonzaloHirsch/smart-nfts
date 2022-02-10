import Web3 from 'web3';
import { FileData, MultipartFormData } from 'aws-multipart-parser/dist/models';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { ropstenNetwork } from '../constants/general.constants';
import { IArguments } from '../interfaces/general.interface';
import { IAbiInput } from '../interfaces/abi.interface';
import { IAbiMethod } from '../interfaces/abi.interface';
import { IMetadata } from '../interfaces/metadata.interface';
import { EXTENSIONS, METADATA_TYPES, STATE_MUTABILITY } from '../constants/contract.constants';
import { typeValidations } from '../helpers/validations.helper';
// Services
import TransactionService from './transaction.service';
import AbiService from './abi.service';
import IpfsService from './ipfs.service';
// Exceptions
import MethodInputException from '../exceptions/invalidInput.exception';
import BlockchainInteractException from '../exceptions/blockchainInteract.exception';
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import InvalidInputException from '../exceptions/invalidInput.exception';


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

    handleMintCall = async (
        storedContract: IStoredContract,
        methodId: string,
        formData: MultipartFormData
    ): Promise<number> => {
        
        if (!storedContract.deployment || !storedContract.deployment.address) {
            throw new ContractNotDeployedException(storedContract.id);
        }
        
        const fileData = formData.token as FileData;

        // Parse the inputs and check if its a valid JSON
        let methodArgs: IArguments;
        let metadataArgs: IArguments;

        try {
            // @ts-ignore
            console.log(formData.inputs, formData.metadata)
            methodArgs = JSON.parse(formData.inputs as string ?? "{}") as IArguments;
            metadataArgs = JSON.parse(formData.metadata as string ?? "{}") as IArguments;
        } catch (err) {
            throw new Error('Invalid JSON input');
        }

        if (storedContract.extensions.includes(EXTENSIONS.ERC721URIStorage)) {
            if (!storedContract.metadata) {
                //TODO throw
            }
            // check metadata input is correct
            this._checkValidMetadata(storedContract.metadata, metadataArgs, fileData != null);

            // Upload the metadata
            const pinnedMetadata = await IpfsService.getInstance().addMetadataWithFileToIPFS(
                metadataArgs, fileData.content, fileData.filename
            );

            methodArgs.uri = pinnedMetadata.ipfsHash;
        }
        
        console.log(methodArgs);

        // Call the minter method
        return await this.handleMethodCall(storedContract, methodId, methodArgs);
    }

    handleMethodCall = async (
        storedContract: IStoredContract,
        methodId: string,
        args: IArguments,
    ): Promise<any> => {

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

    private _checkValidMetadata = (metadataDef: IMetadata, metaArgs: IArguments, hasImage: boolean): void => {
        
        if (metadataDef.hasImage !== hasImage) {
            throw new InvalidInputException('hasImage', 'boolean');
        }

        for (const attributeDef of metadataDef.attributes) {      
            
            const argumentType = attributeDef.traitFormat === METADATA_TYPES.STRING 
                ? attributeDef.traitFormat
                : attributeDef.displayType;

            const argumentValue = metaArgs[attributeDef.traitType]; 
            const typeValidator = typeValidations[argumentType];

            console.log(argumentValue, argumentType)
            if (argumentValue == null) {
                throw new InvalidInputException(attributeDef.traitType, argumentType);
            }

            if (typeValidator == null || !typeValidator(argumentValue)) {
                console.log('INVALID METADATA TYPE')
                throw new InvalidInputException(attributeDef.traitType, argumentType, argumentValue);
            }
        }
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
