import StoredContract, { IStoredContract } from '../models/storedContract.model';
import HttpException from '../exceptions/http.exception';
import DatabaseService from './database.service';
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
        return await StoredContract.create({id: nanoid()}).then(res => res).catch(err => {
            console.error(err);
            throw new HttpException(500, '', 'Internal server error');
        });
    }

    public getContractById = async (contractId: string) : Promise<IStoredContract | null> => {
        return await StoredContract.findOne({id: contractId}).exec()
    }
}

export default StoredContractService;
