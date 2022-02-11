import { EXTENSIONS } from '@/js/constants';

export const mapFormToApiData = (formData) => {
    const data = {
        name: formData.name,
        symbol: formData.symbol,
        extensions: [],
        metadata: {
            hasImage: formData.hasImage,
            attributes: formData.metadata.map(field => {
            return {
                traitType: field.name,
                displayType: field.display,
                traitFormat: field.type
            }
        })}
    };
    if (formData.isMintable) data.extensions.push(EXTENSIONS.MINTABLE);
    if (formData.isPausable) data.extensions.push(EXTENSIONS.PAUSABLE);
    if (formData.isBurnable) data.extensions.push(EXTENSIONS.BURNABLE);
    if (formData.isAutoIncrementIds) data.extensions.push(EXTENSIONS.AUTO_INCREMENT_IDS);
    if (formData.isEnumerable) data.extensions.push(EXTENSIONS.ENUMERABLE);
    if (formData.isURIStorage) data.extensions.push(EXTENSIONS.URI_STORAGE);
    return data;
};

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
    return mappedExtensions;
}

export const mapApiMetadataToForm = (metadata) => {
    return [metadata.hasImage, metadata.attributes.map(field => {
        return {
            name: field.traitType,
            type: field.traitFormat,
            display: field.displayType
        }
    })];
};