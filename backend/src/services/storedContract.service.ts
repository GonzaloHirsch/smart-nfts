// Models
import StoredContract, { IStoredContract } from '../models/storedContract.model';
// Services
import DatabaseService from './database.service';
import CreationService from './creation.service';
// Exceptions
import NotFoundException from '../exceptions/notFoundException.exception';
import InvalidInputException from '../exceptions/invalidInput.exception';
// Others
import { EXTENSIONS } from '../constants/contract.constants';
import { customAlphabet } from 'nanoid';
import { FilterQuery } from 'mongoose';
import { IMetadata } from '../interfaces/metadata.interface';
import { typeValidations } from '../helpers/validations.helper';
import { SHA3 } from 'sha3';
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
        return await StoredContract.create({id: nanoid()})
    }

    public getContractById = async (contractId: string) : Promise<IStoredContract | null> => {
        return await StoredContract.findOne({id: contractId}).exec()
    }

    public getContractByQuery = async (query: FilterQuery<IStoredContract>) : Promise<IStoredContract[]> => {
        return await StoredContract.find(query).exec()
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
            contractString = CreationService.getInstance().genContract(contract.name, contract.symbol, [...contract.extensions] as EXTENSIONS[]);
        }
    
        return {contract, contractString};
    }

    public updateContract = async (
        contractId: string,
        name: string,
        symbol: string,
        extensions: EXTENSIONS[],
        metadata: IMetadata
    ): Promise<{contract: IStoredContract, contractString: string}> => {
        /* Make sure it can add metadata, after reviewing the flow, this shouldn't be validated
        If the user chooses not to have URIStorage, it will need to remove the configured metadata, which won't be
        available again if the user changes it's mind, making them lose the progress */
        // if (!extensions.includes(EXTENSIONS.ERC721URIStorage) && metadata.length > 0) throw new InvalidContractOptionsException(contractId);

        // Check valid name and symbol
        if (!typeValidations.name(name)) {
            throw InvalidInputException.Type('name', 'string', name);
        }
        if (!typeValidations.symbol(symbol)) {
            throw InvalidInputException.Type('symbol', 'string', name);
        }

        // Find contract in the DB
        const contract = await this.getEnforcedContractById(contractId);

        const extHas = (extension: EXTENSIONS) => extensions.includes(extension);

        // Throw if there is an invalid extension combination
        if ((extHas(EXTENSIONS.AutoIncrementIds) && !extHas(EXTENSIONS.Mintable))
        || (extHas(EXTENSIONS.UniqueStorage) && !extHas(EXTENSIONS.ERC721URIStorage))) {
            throw InvalidInputException.Extension();
        }
      
        const extensionCopy = [...extensions];

        // Generate updated contract
        const contractString = CreationService.getInstance().genContract(name, symbol, extensions as EXTENSIONS[]);
        
        // Digest the content    
        hash.reset();
        hash.update(contractString);
        const contractDigest = hash.digest('hex');
      
        // Store the new selection
        contract.name = name;
        contract.symbol = symbol;
        contract.extensions = extensionCopy;
        contract.metadata.hasImage = metadata.hasImage;
        contract.metadata.attributes = metadata.attributes;
        contract.digest = contractDigest;
        contract.markModified('metadata');
        await contract.save();

        return {contract, contractString};
    }

}

export default StoredContractService;
