import { METADATA_DISPLAY_TYPES, METADATA_TYPES } from "../constants/contract.constants";

export type IMetadata = {
    hasImage: boolean,
    attributes: IAttribute[]
}

export interface IAttribute {
    trait_type: string,
    display_type: METADATA_DISPLAY_TYPES,
    trait_format: METADATA_TYPES
};