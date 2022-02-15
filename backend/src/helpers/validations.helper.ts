import { Keccak } from 'sha3';
const hash = new Keccak(256);

export const isEmptyPathParams = (pathParameters: any) => {
  return pathParameters === null || pathParameters === undefined;
};

export const isEmptyBody = (body: any) => {
  return body === null || body === undefined;
};

// TODO: We can check for the format or the length too to avoid DB calls
export const validContractId = (contractId: string | null | undefined) => {
  return contractId !== null && contractId !== undefined && contractId.trim().length > 0;
};



// Limit for uint256 numbers
const uint256Limit = (2 ** 256) - 1;

export const typeValidations: { [key: string]: (input: any) => boolean } = {
    address: (input: any) => (isAddress(input)),
    uint256: (input: any) => (isNumber(input) && isUint256(input)),
    bytes4: (input: any) => (isBytes4(input)),
    bytes: (input: any) => (isBytes(input)) ,
    bool: (input: any) => (isBool(input)),
    string: (input: any) => (max256(input)),
    number: (input: any) => (isNumber(input)),
    boost_number: (input: any) => (isNumber(input)),
    boost_percentage: (input) => (isPercentage(input)),
    name: (input: any) => (max256(input) && isName(input)),
    symbol: (input: any) => (max256(input) && isSymbol(input)),
}

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
const isChecksumAddress = (address: string): boolean => {
    // Check each case
    address = address.replace('0x', '');
    // Need to reset the hash in order to avoid errors
    hash.reset();
    hash.update(address.toLowerCase());
    const addressHash = hash.digest('hex');
    for (let i = 0; i < 40; i++) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

// Taken from https://ethereum.stackexchange.com/a/1379
/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
const isAddress = (address: string): boolean => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

const isUint256 = (num: number): boolean => {
    if (isNaN(num)) return false;
    return num >= 0 && num <= uint256Limit;
};

const isBytes4 = (bytes: string): boolean => {
    return /^(0x)?[0-9a-fA-F]{8}$/i.test(bytes);
};

const isBytes = (bytes: string): boolean => {
    return /^(0x)?[0-9a-fA-F]+$/i.test(bytes);
};

const isBool = (bool: string | boolean): boolean => {
    return bool === true || bool === false || bool === 'true' || bool === 'false';
};

const max256 = (text: string): boolean => {
    return text.length <= 256;
}

const isNumber = (num: any): boolean=> {
    const stringNum = num.toString();
    const onlyNumbers = /^[0-9]+[\.]?[0-9]*$/i.test(stringNum)
    const floatNum = parseFloat(stringNum);
    return !isNaN(floatNum) && onlyNumbers;
};

const isPercentage = (num: any): boolean => {
    if (!isNumber(num)) return false;
    let _num = parseFloat(num.toString());
    return _num >= 0 && _num <= 100;
};

const isName = (name: string): boolean => {
    return /^[a-zA-Z0-9_]+$/i.test(name);
};

const isSymbol = (symbol: string): boolean => {
    return /^[a-zA-Z0-9_]+$/i.test(symbol);
};