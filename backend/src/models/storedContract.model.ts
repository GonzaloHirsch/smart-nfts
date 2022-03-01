import { Document, model, models, Schema } from 'mongoose';
import { IMetadata } from '../interfaces/metadata.interface';
import { METHOD_TYPE, STATE_MUTABILITY, CONTRACT_TYPES, SUPPORTED_NETWORKS } from '../constants/contract.constants';
import { ACCEPTED_LANGUAGES } from '../constants/general.constants';
import { IAbi } from '../interfaces/abi.interface';
import { METADATA_DISPLAY_TYPES, METADATA_TYPES } from '../constants/metadata.constants';
import { IArguments } from '../interfaces/general.interface';

export interface IStoredContract extends Document {
    id: string; // Ids propios o de mongo?
    name: string;
    symbol: string;
    extensions: Array<string>;
    inputs: IArguments;
    digest: string;
    compilation?: {
        bytecode: string;
        abi: IAbi;
        compilerVersion: string;
        digest: string;
        date: Date;
        extensions: Array<string>;
        inputs: IArguments;
    };
    deployment: {
        address: string;
        date: Date;
        compilerVersion: string;
        network: SUPPORTED_NETWORKS;
        abi: IAbi;
        extensions: Array<string>;
        inputs: IArguments;
        digest: string;
    };
    verification: {
        verified: boolean;
        verifiedAddress: string;
        date: Date;
    };
    reminder: {
        date: Date;
        language: ACCEPTED_LANGUAGES;
    };
    metadata: IMetadata;
}

const StoredConstractSchema = new Schema(
    {
        id: { type: String, unique: true, required: true },
        name: { type: String },
        symbol: { type: String },
        extensions: [{ type: String }],
        inputs: { type: {} },
        digest: { type: String },
        compilation: {
            bytecode: { type: String },
            compilerVersion: {
                type: String,
                required: false
            },
            digest: {
                type: String,
                required: false
            },
            abi: [
                {
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
                }
            ],
            date: {
                type: Date,
                required: false
            },
            extensions: [{ type: String }],
            inputs: { type: {} }
        },
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
            },
            extensions: [{ type: String }],
            digest: {
                type: String,
                required: false
            },
            abi: [
                {
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
                }
            ],
            inputs: { type: {} }
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
        reminder: {
            date: {
                type: Date,
                required: false
            },
            language: { type: String, required: false, enum: ACCEPTED_LANGUAGES }
        },
        metadata: {
            hasImage: {
                type: Boolean,
                required: false,
                default: true
            },
            attributes: [
                {
                    traitType: { type: String, required: true },
                    displayType: { type: String, required: false, enum: METADATA_DISPLAY_TYPES },
                    traitFormat: { type: String, required: true, enum: METADATA_TYPES }
                }
            ]
        }
    },
    {
        timestamps: true
    }
);

export default models.StoredContract || model<IStoredContract>('StoredContract', StoredConstractSchema);
