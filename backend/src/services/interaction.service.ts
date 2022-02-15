import Web3 from 'web3';
import { FileData, MultipartFormData } from 'aws-multipart-parser/dist/models';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { IEventData, IEventDataReturnValues, IInteractResponse } from '../interfaces/blockchain.interface';
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

        if (storedContract.extensions.includes(EXTENSIONS.ERC721URIStorage)) {
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
        const method = AbiService.getInstance().getContractMethod(storedContract.abi, methodId);

        // Check the arguments match the inputs of the methods
        this._checkValidInputs(method.inputs, args);

        // Get the web3 Contract
        const contract = new this.web3.eth.Contract(storedContract.abi as any, address);

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

    listTokenOwners = async (
        storedContract: IStoredContract
    ): Promise<{ [tokenId: string]: string }> => {
        
        const contract = new this.web3.eth.Contract(storedContract.abi as any, storedContract.deployment.address);
        
        // Generate a list of IDs
        // Filter from block 1 as per: https://ethereum.stackexchange.com/questions/71307/mycontract-getpasteventsallevents-returns-empty-array
        const eventData = await contract.getPastEvents('Transfer', { fromBlock: 1});

        // List tokenIds
        console.log(Object.keys((eventData).reduce((accum, event) => {
            // @ts-ignore
            accum[event.returnValues.tokenId] = true;
            return accum;
        }, {})));

        // Sort from oldest to newest events
        const sortedEventData = eventData
            .sort(
                (a: IEventData, b: IEventData) =>
                    a.blockNumber - b.blockNumber ||
                    a.transactionIndex - b.transactionIndex,
                );

        const eventDataByTokenId: {[tokenId: string]: IEventDataReturnValues[]} = {};
        const tokenIdOwners: {[tokenId: string]: string} = {};

        // Separate events by the tokenId involved
        sortedEventData.forEach((event: IEventData) => {
            // If new token, declare an empty array to start
            if (!eventDataByTokenId[event.returnValues.tokenId]) {
                eventDataByTokenId[event.returnValues.tokenId] = [];
            }
            // Add the return values for Transfer event
            eventDataByTokenId[event.returnValues.tokenId].push(event.returnValues);
        });

        // Get the last transaction to know where the token ended up
        Object.keys(eventDataByTokenId).forEach((tokenId: string) => {
            const totalTransfers = eventDataByTokenId[tokenId].length;
            const lastTransfer = eventDataByTokenId[tokenId][totalTransfers - 1];
            console.log('LAST TRANSFER = ', lastTransfer)
            tokenIdOwners[tokenId] = lastTransfer.to;
        });

        console.log(JSON.stringify(tokenIdOwners));

        return tokenIdOwners;


        /*
        Response format, array of:
        {
            "address":"0x3a39C6b963c70777d191601aE25C1966aDd85C41",
            "blockHash":"0xc8dc51489633a9690d5c0bf6e9ba749f829255b395d9290b891a7b318047e040",
            "blockNumber":10151752,
            "logIndex":0,
            "removed":false,
            "transactionHash":"0xd2f772a09a119df4cbb9ad6571538b1e05428f00869d4dba80867bbf7e212b41",
            "transactionIndex":1,
            "id":"log_523f23d4",
            "returnValues":{
                "0":"0x0000000000000000000000000000000000000000",
                "1":"0xA3D9E7D1c697EDB3C37d73200149b01749853ab4",
                "2":"2",
                "from":"0x0000000000000000000000000000000000000000",
                "to":"0xA3D9E7D1c697EDB3C37d73200149b01749853ab4",
                "tokenId":"2"
            },
            "event":"Transfer",
            "signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "raw":{
                "data":"0x",
                "topics":[
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "0x000000000000000000000000a3d9e7d1c697edb3c37d73200149b01749853ab4",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }
        },
        */
        
    //     const token = await ethers.getContractAt(ERC721.abi, tokenAddress, ethers.provider);
      
    //     console.error(await token.name(), 'tokens owned by', account);
      
    //     const sentLogs = await token.queryFilter(
    //       token.filters.Transfer(account, null),
    //     );
    //     const receivedLogs = await token.queryFilter(
    //       token.filters.Transfer(null, account),
    //     );
      
    //     const logs = sentLogs.concat(receivedLogs)
    //       .sort(
    //         (a, b) =>
    //           a.blockNumber - b.blockNumber ||
    //           a.transactionIndex - b.TransactionIndex,
    //       );
      
    //     const owned = new Set();
      
    //     for (const log of logs) {
    //       const { from, to, tokenId } = log.args;
          
    //       if (addressEqual(to, account)) {
    //         owned.add(tokenId.toString());
    //       } else if (addressEqual(from, account)) {
    //         owned.delete(tokenId.toString());
    //       }
    //     }
      
    //     console.log([...owned].join('\n'));
      };
}

export default InteractionService;
