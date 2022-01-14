import { METHOD_TYPE, STATE_MUTABILITY, PARAMETER_TYPE } from '../constants/contract.constants';
import { Document, model, Schema } from 'mongoose';
import { IAbi } from '../interfaces/abi.interface';

export interface IStoredContract extends Document{
    id: string, // Ids propios o de mongo?
    abi: IAbi,
    deployedAddress: string;
}
  
const StoredConstractSchema = new Schema(
    {
        id: { type: String, unique: true, required: true },
        abi: [{
            name: { type: String, required: true },
            type: { type: String, required: true, enum: METHOD_TYPE},
            stateMutability: { type: String, required: false, enum: STATE_MUTABILITY},
            anonymous: { type: Boolean, required: false },
            inputs: [
                {
                    name: { type: String, required: true },
                    type: { type: String, required: true },
                    indexed: { type: Boolean, required: false },
                    internalType: { type: String, enum: PARAMETER_TYPE}
                }
            ],
            outputs: [
                {
                    name: { type: String, required: true },
                    type: { type: String, required: true },
                    internalType: { type: String, enum: PARAMETER_TYPE}
                }
            ]
        }],
        deployedAddress: { type: String, required: false }
    }
);

export default model<IStoredContract>('StoredContract', StoredConstractSchema);
