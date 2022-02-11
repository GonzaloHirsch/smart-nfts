import { METADATA_DISPLAY_TYPES, METADATA_TYPES } from "../constants/contract.constants";

// Our metadata definitions
export type IMetadata = {
    hasImage: boolean,
    attributes: IMetadataAttribute[]
}

export interface IMetadataAttribute {
    traitType: string,
    displayType?: METADATA_DISPLAY_TYPES,
    traitFormat: METADATA_TYPES
};

// OpenSea standard definitions

export interface IStandardMetadataAttribute {
    traitType: string,
    displayType?: METADATA_DISPLAY_TYPES,
    value: any
};

export interface IStandardMetadata {
    name: string,
    description: string,
    image?: string,
    attributes: IStandardMetadataAttribute[]
};