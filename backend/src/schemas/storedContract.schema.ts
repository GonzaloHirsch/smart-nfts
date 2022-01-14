import { IStoredContract } from '../interfaces/storedContract.interface';
import { IAbi } from '../interfaces/abi.interface';
import { Schema } from 'mongoose';

const schema = new Schema<IStoredContract>({
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, required: false },
  abi: {
    type: [
      {
        type: String,
        name: String,
        stateMutability: String,
        inputs: [
          {
            name: String,
            type: String,
            components: [
              {
                name: String,
                type: String
              }
            ]
          }
        ],
        outputs: [
          {
            name: String,
            type: String,
            components: [
              {
                name: String,
                type: String
              }
            ]
          }
        ]
      }
    ],
    required: false,
    default: []
  },
  deployedAddress: { type: String, required: false }
});
