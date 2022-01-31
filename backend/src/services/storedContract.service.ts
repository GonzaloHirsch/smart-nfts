// Models
import StoredContract, { IStoredContract } from '../models/storedContract.model';
// Services
import DatabaseService from './database.service';
import CreationService from './creation.service';
// Exceptions
import ContractNotFoundException from '../exceptions/contractNotFound.exception';
// Others
import { EXTENSIONS } from '../constants/contract.constants';
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

    public getEnforcedContractById = async (contractId: string): Promise<IStoredContract> => {
        // Find contract in the DB
        const contract = await this.getContractById(contractId);
        // Verify not null
        if (contract == null) throw new ContractNotFoundException(contractId);

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
        extensions: EXTENSIONS[]
    ): Promise<{contract: IStoredContract, contractString: string}> => {

        // Find contract in the DB
        const contract = await this.getEnforcedContractById(contractId);
      
        const extensionCopy = [...extensions];

        // Generate updated contract
        const contractString = CreationService.getInstance().genContract(name, symbol, extensions as EXTENSIONS[]);
      
        // Store the new selection
        contract.name = name;
        contract.symbol = symbol;
        contract.extensions = extensionCopy;
        await contract.save();

        return {contract, contractString};
    }

}

export default StoredContractService;
