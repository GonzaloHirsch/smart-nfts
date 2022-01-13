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
    return data;
};