import { Document, model, models, Schema } from 'mongoose';
import { IMetadata } from '../interfaces/metadata.interface';
import { METHOD_TYPE, STATE_MUTABILITY, CONTRACT_TYPES, SUPPORTED_NETWORKS } from '../constants/contract.constants';
import { IAbi } from '../interfaces/abi.interface';
import { METADATA_DISPLAY_TYPES, METADATA_TYPES } from '../constants/metadata.constants';

export interface IStoredContract extends Document {
    id: string; // Ids propios o de mongo?
    name: string;
    symbol: string;
    extensions: Array<string>;
    abi: IAbi;
    deployment: {
        address: string;
        date: Date;
        compilerVersion: string;
        network: SUPPORTED_NETWORKS;
    };
    verification: {
        verified: boolean;
        verifiedAddress: string;
        date: Date;
    };
    metadata: IMetadata
}

const StoredConstractSchema = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String },
    symbol: { type: String },
    extensions: [{ type: String }],
    abi: [{
        name: { type: String, required: false },
        type: { type: String, required: true, enum: METHOD_TYPE },
        stateMutability: { type: String, required: false, enum: STATE_MUTABILITY },
        anonymous: { type: Boolean, required: false },
        inputs: [
            {
            name: { type: String, required: false },
            type: { type: String, required: true },
            indexed: { type: Boolean, required: false },
            internalType: { type: String, enum: CONTRACT_TYPES }
            }
        ],
        outputs: [
            {
            name: { type: String, required: false },
            type: { type: String, required: true },
            internalType: { type: String, enum: CONTRACT_TYPES }
            }
        ]
    }],
    deployment: {
        address: { type: String, required: false },
        date: {
            type: Date,
            required: false
        },
        compilerVersion: {
            type: String,
            required: false
        },
        network: {
            type: String,
            required: false,
            enum: SUPPORTED_NETWORKS
        }
    },
    verification: {
        verified: {
            type: Boolean,
            required: false
        },
        verifiedAddress: {
            type: String,
            required: false
        },
        date: {
            type: Date,
            required: false
        }
    },
    metadata: {
        hasImage: {
            type: Boolean,
            required: false,
            default: true
        },
        attributes: [{
            traitType: { type: String, required: true },
            displayType: { type: String, required: false, enum: METADATA_DISPLAY_TYPES },
            traitFormat: { type: String, required: true, enum: METADATA_TYPES },
        }]
    }
},
{
  timestamps: true
});

export default models.StoredContract || model<IStoredContract>('StoredContract', StoredConstractSchema);
