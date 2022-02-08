import { Document, model, models, Schema } from 'mongoose';
import { IMetadata } from '../interfaces/metadata.interface';
import { METHOD_TYPE, STATE_MUTABILITY, PARAMETER_TYPE, METADATA_TYPES, METADATA_DISPLAY_TYPES, SUPPORTED_NETWORKS } from '../constants/contract.constants';
import { IAbi } from '../interfaces/abi.interface';

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
            internalType: { type: String, enum: PARAMETER_TYPE }
            }
        ],
        outputs: [
            {
            name: { type: String, required: false },
            type: { type: String, required: true },
            internalType: { type: String, enum: PARAMETER_TYPE }
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
            trait_type: { type: String, required: true },
            display_type: { type: String, required: false, enum: METADATA_DISPLAY_TYPES },
            trait_format: { type: String, required: true, enum: METADATA_TYPES },
        }]
    }
},
{
  timestamps: true
});

export default models.StoredContract || model<IStoredContract>('StoredContract', StoredConstractSchema);
