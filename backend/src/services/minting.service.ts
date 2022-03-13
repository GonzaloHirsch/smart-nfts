import ObjectHash from 'object-hash';
import { FileData, MultipartFormData } from 'aws-multipart-parser/dist/models';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { IInteractResponse } from '../interfaces/blockchain.interface';
import { IArguments } from '../interfaces/general.interface';
import { IMetadata, IStandardMetadata, IStandardMetadataAttribute } from '../interfaces/metadata.interface';
import { EXTENSIONS } from '../constants/contract.constants';
import { DEFAULT_METADATA_FIELDS, METADATA_TYPES } from '../constants/metadata.constants';
import { FILE_SIZE_LIMIT } from '../constants/general.constants';
import { typeValidations } from '../helpers/validations.helper';
// Services
import IpfsService from './ipfs.service';
import InteractionService from './interaction.service';
// Exceptions
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import InvalidInputException from '../exceptions/invalidInput.exception';
import InvalidContractOptionsException from '../exceptions/invalidContractOptionsException.exception';

class MintingService {
    private static instance: MintingService;

    static getInstance = () => {
        if (!MintingService.instance) {
            MintingService.instance = new MintingService();
        }
        return MintingService.instance;
    };

    handleMintCall = async (storedContract: IStoredContract, methodId: string, formData: MultipartFormData): Promise<IInteractResponse> => {
        if (!storedContract.deployment || !storedContract.deployment.address) {
            throw new ContractNotDeployedException(storedContract.id);
        }

        const fileData = formData.token as FileData;
        const extensions = storedContract.deployment.extensions;

        // Parse the inputs and check if its a valid JSON
        let methodArgs: IArguments;
        let metadataArgs: IArguments;

        try {
            methodArgs = JSON.parse((formData.inputs as string) ?? '{}') as IArguments;
            metadataArgs = JSON.parse((formData.metadata as string) ?? '{}') as IArguments;
        } catch (err) {
            throw new Error('Invalid JSON input');
        }

        if (extensions.includes(EXTENSIONS.ERC721URIStorage)) {
            // Get the metadata definition
            const metadataDef = storedContract.metadata;

            if (!metadataDef) {
                throw new InvalidContractOptionsException(storedContract.id);
            }
            
            // check metadata input is correct
            const standardMetadata = this._checkAndMapToStandardMetadata(metadataDef, metadataArgs, fileData != null);

            // Verify size limit and filetype
            if (metadataDef.hasImage) {
                if (Buffer.byteLength(fileData.content) > FILE_SIZE_LIMIT) {
                    throw InvalidInputException.Size('token', Buffer.byteLength(fileData.content) / 1000000);
                } else if (!/^image\/.*$/.test(fileData.contentType)) {
                    throw InvalidInputException.Type('token', 'file', fileData.contentType);
                }
            }

            // Upload the metadata
            const pinnedMetadata = metadataDef.hasImage
                ? await IpfsService.getInstance().addMetadataWithFileToIPFS(standardMetadata, fileData.content, fileData.filename)
                : await IpfsService.getInstance().addJSONToIPFS(standardMetadata, metadataArgs.name);

            // Set the uri to pass to the method call
            methodArgs.uri = pinnedMetadata.ipfsHash;

            // Add the metadata hash to the args if contract includes unique storage
            if (extensions.includes(EXTENSIONS.UniqueStorage)) {
                methodArgs.hash = this._createMetadataHash(standardMetadata);
            }
        }

        // Call the minter method
        return InteractionService.getInstance(storedContract.deployment.network).handleMethodCall(storedContract, methodId, methodArgs);
    };

    _checkAndMapToStandardMetadata = (
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

        // Check default fields are present
        for (const defaultField of DEFAULT_METADATA_FIELDS) {
            if (metaArgs[defaultField] == null) {
                throw InvalidInputException.Missing(defaultField, 'string');
            }
        }
        
        // check default fields are valid
        if (!typeValidations.string(metaArgs.name)) {
            throw InvalidInputException.Type('name', 'string', metaArgs.name);
        }
        if (!typeValidations.string(metaArgs.description)) {
            throw InvalidInputException.Type('description', 'string', metaArgs.description);
        }

        const standardMetadata: IStandardMetadata = {
            name: metaArgs.name.trim(),
            description: metaArgs.description.trim(),
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
                trait_type: attributeDef.traitType.trim(),
                value: argumentValue
            };

            if (attributeDef.displayType != null) {
                standardAttribute.display_type = attributeDef.displayType;
            }

            standardMetadata.attributes.push(standardAttribute);
        }

        return standardMetadata;
    };

    private _createMetadataHash = (metadata: IStandardMetadata): string => {
        return ObjectHash(metadata, { algorithm: 'sha1' });
    };
}

export default MintingService;
