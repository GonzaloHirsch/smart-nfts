import { Keccak } from 'sha3';
const hash = new Keccak(256);

// Limit for uint256 numbers
const uint256Limit = (2 ** 256) - 1;

export const allValidations = {
    "required": {
        label: "Field is required",
        func: (input) => (input !== null && input !== undefined && input !== '' && input.trim() !== '') || "inputs.errors.required"
    },
    "address": {
        label: "Field must be valid address",
        func: (input) => (isAddress(input)) || "inputs.errors.address"
    },
    "uint256": {
        label: "Field must be valid uint256 number",
        func: (input) => (isUint256(input)) || "inputs.errors.uint256"
    },
    "bytes4": {
        label: "Field must be valid bytes4",
        func: (input) => (isBytes4(input)) || "inputs.errors.bytes4"
    },
    "bytes": {
        label: "Field must be valid bytes",
        func: (input) => (isBytes(input)) || "inputs.errors.bytes"
    },
    "bool": {
        label: "Field must be valid boolean (true | false)",
        func: (input) => (isBool(input)) || "inputs.errors.bool"
    },
    "name": {
        label: "Name can only contain alphanumeric characters and underscore (_)",
        func: (input) => (isName(input)) || "inputs.errors.name"
    },
    "symbol": {
        label: "Symbol can only contain alphanumeric characters and underscore (_)",
        func: (input) => (isSymbol(input)) || "inputs.errors.symbol"
    },
    "metadataName": {
        label: "This field can only contain letters, numbers, and _",
        func: (input) => (isMetadata(input)) || "inputs.errors.metadataName"
    },
    "max20": {
        label: "This field can have a maximum of 20 characters",
        func: (input) => (maxLength(20, input)) || "inputs.errors.max20"
    },
    "string": {
        label: "Invalid text, maximum length is 256 characters.",
        func: (input) => (maxLength(256, input)) || "inputs.errors.string"
    },
    "long_string": {
        label: "Invalid text, maximum length is 700 characters.",
        func: (input) => (maxLength(700, input)) || "inputs.errors.long_string"
    },
    "number": {
        label: "Not a valid number",
        func: (input) => (isNumber(input)) || "inputs.errors.number"
    },
    "boost_number": {
        label: "Not a valid number",
        func: (input) => (isNumber(input)) || "inputs.errors.number"
    },
    "boost_percentage": {
        label: "Invalid percentage, must be between 0 and 100 (without %)",
        func: (input) => (isPercentage(input)) || "inputs.errors.boost_percentage"
    },
    "email": {
        label: "Invalid email",
        func: (input) => (isEmail(input)) || "inputs.errors.email"
    }
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
    if (isNaN(num) || num.toString().includes('.')) return false;
    let _num = parseInt(num, 10);
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

const isName = (name) => {
    return /^[a-zA-Z0-9_]+$/i.test(name);
};

const isSymbol = (symbol) => {
    return /^[a-zA-Z0-9_]+$/i.test(symbol);
};

const isMetadata = (metadataName) => {
    return /^[a-zA-Z0-9_ ]{0,20}$/i.test(metadataName);
};

const maxLength = (length, text) => {
    return text.length <= length;
}

const isPercentage = (num) => {
    if (isNaN(num)) return false;
    let _num = parseFloat(num, 10);
    return _num >= 0 && _num <= 100;
};

const isNumber = (num) => {
    if (isNaN(num)) return false;
    return true;
};

const isEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

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

export const sumarizeValidationResults = (validationResult) => {
    let isValid = true;
    // Reset error
    let error = undefined;
    // Evaluate if there are errors
    validationResult.forEach((result) => {
      isValid = isValid && result === true;
      // Keep first error present
      if (result !== true && error === undefined) {
        error = result.message;
      }
    });
    return [isValid, error];
}