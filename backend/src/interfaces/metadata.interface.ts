import { METADATA_DISPLAY_TYPES, METADATA_TYPES } from "../constants/contract.constants";

export type IMetadata = {
    hasImage: boolean,
    attributes: IMetadataAttribute[]
}

export interface IMetadataAttribute {
    traitType: string,
    displayType: METADATA_DISPLAY_TYPES,
    traitFormat: METADATA_TYPES
};