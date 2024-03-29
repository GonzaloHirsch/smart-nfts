import { customAlphabet } from 'nanoid';
import { SHA3 } from 'sha3';
import { FilterQuery } from 'mongoose';
// Models
import StoredContract, { IStoredContract } from '../models/storedContract.model';
// Services
import DatabaseService from './database.service';
import CreationService from './creation.service';
// Exceptions
import NotFoundException from '../exceptions/notFoundException.exception';
import InvalidInputException from '../exceptions/invalidInput.exception';
// Others
import { EXTENSIONS, UPDATE_TYPES } from '../constants/contract.constants';
import { IMetadata } from '../interfaces/metadata.interface';
import { IArguments } from '../interfaces/general.interface';

const hash = new SHA3(512);
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 15);


class StoredContractService {
    private static instance: StoredContractService;
    private static databaseService: DatabaseService; 

    static getInstance = async () => {
        if (!StoredContractService.instance) {
            StoredContractService.instance = new StoredContractService();
            StoredContractService.databaseService = await DatabaseService.getInstance();
        }
        return StoredContractService.instance;
    };

    public createContract = async () : Promise<IStoredContract> => {
        return StoredContract.create({id: nanoid()})
    }

    public getContractById = async (contractId: string) : Promise<IStoredContract | null> => {
        return StoredContract.findOne({id: contractId}).exec()
    }

    public getContractByQuery = async (query: FilterQuery<IStoredContract>) : Promise<IStoredContract[]> => {
        return StoredContract.find(query).exec()
    }

    public getEnforcedContractById = async (contractId: string): Promise<IStoredContract> => {
        // Find contract in the DB
        const contract = await this.getContractById(contractId);
        // Verify not null
        if (contract == null) throw NotFoundException.Contract(contractId);

        return contract;            
    }

    public getContractContentsById = async (
        contractId: string
    ) : Promise<{contract: IStoredContract, contractString: string | null}> => {
        
        // Find contract in the DB
        const contract = await this.getEnforcedContractById(contractId);
    
        // Generate the contract itself if it has been edited
        let contractString = null;
        if (contract.name) {
            contractString = CreationService.getInstance().genContract(contract.name, contract.symbol, [...contract.extensions] as EXTENSIONS[], contract.inputs ?? {});
        }
    
        return {contract, contractString};
    }

    public updateContract = async (
        contractId: string,
        name: string,
        symbol: string,
        extensions: EXTENSIONS[],
        inputs: IArguments,
        metadata: IMetadata, 
        updateType: UPDATE_TYPES
    ): Promise<{contract: IStoredContract, contractString: string}> => {
        /* Make sure it can add metadata, after reviewing the flow, this shouldn't be validated
        If the user chooses not to have URIStorage, it will need to remove the configured metadata, which won't be
        available again if the user changes it's mind, making them lose the progress */

        // Find contract in the DB
        const contract = await this.getEnforcedContractById(contractId);

        let contractString = '';

        if (updateType === UPDATE_TYPES.ALL || updateType === UPDATE_TYPES.METADATA) {
            contract.metadata.hasImage = metadata.hasImage;
            contract.metadata.attributes = metadata.attributes;
            contract.markModified('metadata');
        } 
        if (updateType === UPDATE_TYPES.ALL || updateType === UPDATE_TYPES.CONTRACT) {

            const extHas = (extension: EXTENSIONS) => extensions.includes(extension);

            // Throw if there is an invalid extension combination
            if ((extHas(EXTENSIONS.AutoIncrementIds) && !extHas(EXTENSIONS.Mintable))
            || (extHas(EXTENSIONS.UniqueStorage) && !extHas(EXTENSIONS.ERC721URIStorage))) {
                throw InvalidInputException.Extension();
            }
        
            const extensionCopy = [...extensions];

            // Generate updated contract
            contractString = CreationService.getInstance().genContract(name, symbol, extensions, inputs);
            
            // Digest the content    
            hash.reset();
            hash.update(contractString);
            const contractDigest = hash.digest('hex');
        
            // Store the new selection
            contract.name = name;
            contract.symbol = symbol;
            contract.extensions = extensionCopy;
            contract.inputs = inputs;
            contract.digest = contractDigest;
            contract.markModified('inputs');
        }
        
        await contract.save();

        return {contract, contractString};
    }

}

export default StoredContractService;
