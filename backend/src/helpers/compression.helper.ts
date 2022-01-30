import AdmZip from 'adm-zip';

export const generateContractZip = (contents: string) : Buffer => {
    const zip = new AdmZip();
    // Add file directly
    zip.addFile("contract.sol", Buffer.from(contents, "utf8"));
    // get everything as a buffer
    const zipBuffer = zip.toBuffer();
    return zipBuffer; 
};