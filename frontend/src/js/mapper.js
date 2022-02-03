import { EXTENSIONS } from '@/js/constants';

export const mapFormToApiData = (formData) => {
    const data = {
        name: formData.name,
        symbol: formData.symbol,
        extensions: []
    };
    if (formData.isMintable) data.extensions.push(EXTENSIONS.MINTABLE);
    if (formData.isPausable) data.extensions.push(EXTENSIONS.PAUSABLE);
    if (formData.isBurnable) data.extensions.push(EXTENSIONS.BURNABLE);
    if (formData.isAutoIncrementIds) data.extensions.push(EXTENSIONS.AUTO_INCREMENT_IDS);
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
    if (EXTENSIONS.URI_STORAGE in map) mappedExtensions.isURIStorage = true;
    return mappedExtensions;
}