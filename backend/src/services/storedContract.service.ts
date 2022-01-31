// Models
import StoredContract, { IStoredContract } from '../models/storedContract.model';
// Services
import DatabaseService from './database.service';
import CreationService from './creation.service';
// Exceptions
import ContractNotFoundException from '../exceptions/contractNotFound.exception';
// Others
import { customAlphabet } from 'nanoid';
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

    public getContractContentsById = async (
        contractId: string
    ) : Promise<{contract: IStoredContract, contractString: string | null}> => {
        
        // Find contract in the DB
        const contract = await this.getContractById(contractId);
        // Verify not null
        if (contract == null) throw new ContractNotFoundException(contractId);
    
        // Generate the contract itself if it has been edited
        let contractString = null;
        if (contract.name) {
            contractString = CreationService.getInstance().genContract(contract.name, contract.symbol, [...contract.extensions] as EXTENSIONS[]);
        }
    
        return {contract, contractString};
    }

}

export default StoredContractService;
