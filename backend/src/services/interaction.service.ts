import Web3 from 'web3';
import { FileData, MultipartFormData } from 'aws-multipart-parser/dist/models';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { IInteractResponse } from '../interfaces/blockchain.interface';
import { IArguments } from '../interfaces/general.interface';
import { IAbiInput } from '../interfaces/abi.interface';
import { IAbiMethod } from '../interfaces/abi.interface';
import { IMetadata, IStandardMetadata, IStandardMetadataAttribute } from '../interfaces/metadata.interface';
import { CONTRACT_TYPES, EXTENSIONS, STATE_MUTABILITY } from '../constants/contract.constants';
import { DEFAULT_METADATA_FIELDS, METADATA_TYPES } from '../constants/metadata.constants';
import { MINT_GAS } from '../constants/general.constants';
import { typeValidations } from '../helpers/validations.helper';
// Services
import TransactionService from './transaction.service';
import AbiService from './abi.service';
import IpfsService from './ipfs.service';
// Exceptions
import BlockchainInteractException from '../exceptions/blockchainInteract.exception';
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import InvalidInputException from '../exceptions/invalidInput.exception';
import InvalidContractOptionsException from '../exceptions/invalidContractOptionsException.exception';

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

    handleMintCall = async (
        storedContract: IStoredContract, methodId: string, formData: MultipartFormData
    ): Promise<IInteractResponse> => {
        
        if (!storedContract.deployment || !storedContract.deployment.address) {
            throw new ContractNotDeployedException(storedContract.id);
        }

        const fileData = formData.token as FileData;

        // Parse the inputs and check if its a valid JSON
        let methodArgs: IArguments;
        let metadataArgs: IArguments;

        try {
            methodArgs = JSON.parse((formData.inputs as string) ?? '{}') as IArguments;
            metadataArgs = JSON.parse((formData.metadata as string) ?? '{}') as IArguments;
        } catch (err) {
            throw new Error('Invalid JSON input');
        }

        if (storedContract.deployment.extensions.includes(EXTENSIONS.ERC721URIStorage)) {
            // Get the metadata definition
            const metadataDef = storedContract.metadata;

            if (!metadataDef) {
                throw new InvalidContractOptionsException(storedContract._id);
            }
            // check metadata input is correct
            const standardMetadata = this._checkAndMapToStandardMetadata(
                metadataDef, metadataArgs, fileData != null
            );

            // Upload the metadata
            const pinnedMetadata = metadataDef.hasImage
                ? await IpfsService.getInstance().addMetadataWithFileToIPFS(standardMetadata, fileData.content, fileData.filename)
                : await IpfsService.getInstance().addJSONToIPFS(standardMetadata, metadataArgs.name);

            // Set the uri to pass to the method call
            methodArgs.uri = pinnedMetadata.ipfsHash;
        }

        // Call the minter method
        return await this.handleMethodCall(storedContract, methodId, methodArgs);
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

    private _checkAndMapToStandardMetadata = (
        metadataDef: IMetadata, metaArgs: IArguments, hasImage: boolean
    ): IStandardMetadata => {

        // If the attributes received and the attributes in def is different throw error
        const recievedInputCount = Object.keys(metaArgs.attributes ?? {}).length;
        if (metadataDef.attributes.length !== recievedInputCount) {
            throw InvalidInputException.Count(metadataDef.attributes.length, recievedInputCount);
        }

        // Metadata def must indicate whether or not to accept image
        if (metadataDef.hasImage !== hasImage) {
            throw InvalidInputException.Type('hasImage', metadataDef.hasImage.toString(), hasImage);
        }

        // Check valid default fields are present
        for (const defaultField of DEFAULT_METADATA_FIELDS) {
            if (!metaArgs[defaultField] || typeValidations.string(!metaArgs[defaultField])) {
                throw InvalidInputException.Missing(defaultField, 'string');
            }
        }

        const standardMetadata: IStandardMetadata = {
            name: metaArgs.name,
            description: metaArgs.description,
            attributes: []
        };

        // Check custom attributes are valid and present
        for (const attributeDef of metadataDef.attributes) {
            // If number, use the display type
            const argumentType = attributeDef.traitFormat === METADATA_TYPES.STRING ? attributeDef.traitFormat : attributeDef.displayType!;

            const argumentValue = metaArgs.attributes[attributeDef.traitType];
            const typeValidator = typeValidations[argumentType];

            // If no value is present for attribute --> Error
            if (argumentValue == null) {
                throw InvalidInputException.Missing(attributeDef.traitType, argumentType);
            }

            // If value is present but it is not the correct type --> Error
            if (typeValidator == null || !typeValidator(argumentValue)) {
                throw InvalidInputException.Type(attributeDef.traitType, argumentType, argumentValue);
            }

            // Create the standard attribute with the input received
            const standardAttribute: IStandardMetadataAttribute = {
                trait_type: attributeDef.traitType,
                value:  argumentValue
            }

            if (attributeDef.displayType != null) {
                standardAttribute.display_type = attributeDef.displayType;
            }

            standardMetadata.attributes.push(standardAttribute);
        }

        return standardMetadata;
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
