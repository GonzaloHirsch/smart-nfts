import { EXTENSIONS } from '@/js/constants';

// Front --> API
export const mapFormToApiData = (contractData, metadataData) => {
    const data = {
        name: contractData.name,
        symbol: contractData.symbol,
        extensions: [],
        inputs: {...contractData.extensionInputs},
        metadata: {
            hasImage: metadataData.hasImage,
            attributes: metadataData.metadata.map(field => {
            return {
                traitType: field.name,
                displayType: field.display,
                traitFormat: field.type
            }
        })}
    };
    if (contractData.isMintable) data.extensions.push(EXTENSIONS.MINTABLE);
    if (contractData.isPausable) data.extensions.push(EXTENSIONS.PAUSABLE);
    if (contractData.isBurnable) data.extensions.push(EXTENSIONS.BURNABLE);
    if (contractData.isAutoIncrementIds) data.extensions.push(EXTENSIONS.AUTO_INCREMENT_IDS);
    if (contractData.isEnumerable) data.extensions.push(EXTENSIONS.ENUMERABLE);
    if (contractData.isURIStorage) data.extensions.push(EXTENSIONS.URI_STORAGE);
    if (contractData.isUniqueStorage) data.extensions.push(EXTENSIONS.UNIQUE_STORAGE);
    if (contractData.isLimitSupply) data.extensions.push(EXTENSIONS.LIMIT_SUPPLY);
    return data;
};

// API --> Front
export const mapApiExtensionsToForm = (extensions) => {
    const mappedExtensions = {};
    // Mapped extensions that are present
    const map = extensions.reduce((obj, extensions) => {
        obj[extensions] = true;
        return obj;
    }, {});
    // Check which extensions are present
    if (EXTENSIONS.MINTABLE in map) mappedExtensions.isMintable = true;
    if (EXTENSIONS.PAUSABLE in map) mappedExtensions.isPausable = true;
    if (EXTENSIONS.BURNABLE in map) mappedExtensions.isBurnable = true;
    if (EXTENSIONS.AUTO_INCREMENT_IDS in map) mappedExtensions.isAutoIncrementIds = true;
    if (EXTENSIONS.ENUMERABLE in map) mappedExtensions.isEnumerable = true;
    if (EXTENSIONS.URI_STORAGE in map) mappedExtensions.isURIStorage = true;
    if (EXTENSIONS.UNIQUE_STORAGE in map) mappedExtensions.isUniqueStorage = true;
    if (EXTENSIONS.LIMIT_SUPPLY in map) mappedExtensions.isLimitSupply = true;
    return mappedExtensions;
}

// API --> Front
export const mapApiMetadataToForm = (metadata) => {
    return [metadata.hasImage, metadata.attributes.map(field => {
        return {
            name: field.traitType,
            type: field.traitFormat,
            display: field.displayType
        }
    })];
};

// API --> Front
export const mapExtensionInputsToForm = (inputs) => {
    return inputs;
};