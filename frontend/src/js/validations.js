import { Keccak } from 'sha3';
const hash = new Keccak(256);

// Limit for uint256 numbers
const uint256Limit = (2 ** 256) - 1;

export const allValidations = {
    "required": {
        label: "Field is required",
        func: (input) => (input !== null && input !== undefined && input !== '' && input.trim() !== '') || "interact.error.parameters.required"
    },
    "address": {
        label: "Field must be valid address",
        func: (input) => (isAddress(input)) || "interact.error.parameters.address"
    },
    "uint256": {
        label: "Field must be valid uint256 number",
        func: (input) => (isUint256(input)) || "interact.error.parameters.uint256"
    },
    "bytes4": {
        label: "Field must be valid bytes4",
        func: (input) => (isBytes4(input)) || "interact.error.parameters.bytes4"
    },
    "bytes": {
        label: "Field must be valid bytes",
        func: (input) => (isBytes(input)) || "interact.error.parameters.bytes"
    },
    "bool": {
        label: "Field must be valid boolean (true | false)",
        func: (input) => (isBool(input)) || "interact.error.parameters.bool"
    },
}

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
const isChecksumAddress = (address) => {
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
const isAddress = (address) => {
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

const isUint256 = (num) => {
    if (isNaN(num)) return false;
    let _num = parseFloat(num, 10);
    return _num >= 0 && _num <= uint256Limit;
};

const isBytes4 = (bytes) => {
    return /^(0x)?[0-9a-fA-F]{8}$/i.test(bytes);
};

const isBytes = (bytes) => {
    return /^(0x)?[0-9a-fA-F]+$/i.test(bytes);
};

const isBool = (bool) => {
    return bool === 'true' || bool === 'false';
};

export const applyValidations = (input, validations) => {
    if (!(validations)) return undefined;
    let result;
    return validations.map(validation => {
        result = allValidations[validation].func(input);
        if (result !== true) {
            result = {
                error: validation,
                message: result
            };
        }
        return result;
    });
};