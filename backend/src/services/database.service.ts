import { dbConnect } from '../helpers/dbConnection.helper';
import { model } from 'mongoose';
import { IStoredContract } from '../interfaces/storedContract.interface';
import { storedContractSchema } from '../schemas/storedContract.schema';

class DatabaseService {
  private static instance: DatabaseService;

  static getInstance = async () => {
    if (!DatabaseService.instance) {
      await dbConnect();
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  };

  createContract = (): string => {
    await model<IStoredContract>('StoredContract', storedContractSchema);
  };
}

export default DatabaseService;
