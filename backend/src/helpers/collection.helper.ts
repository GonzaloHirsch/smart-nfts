// ENUMS
export const enumHasKeys = (enumData: any, keys: string[]): boolean => {
    for (const key of keys) {
        if (!(key in enumData)) {
            return false;
        }
    }
    return true;
};

// Flatten array
export const flattenArray = <T>(array: T[][]): T[] => {
    return array.reduce((prev, curr) => prev.concat(curr), [])
}

// Sort method
export const getSortFn = <T>(condition: (input: T) => boolean) => {
    return (a: T, b: T) => condition(a) === condition(b) ? 0 : condition(a) ? -1 : 1;
}

// Objects
export const objectHasKey = <O>(obj: O, key: keyof any): key is keyof O => {
    return key in obj;
};

export const objectHasValue = <O>(obj: O, value: any): boolean => {
    return Object.values(obj).indexOf(value) > -1;
};

// Arrays
export const arrayFindAndRemoveValue = <O>(array: O[], value: O): O[] => {
    const index = array.indexOf(value);

    if (index > -1) {
        array.splice(index, 1);
    }

    return array;
};

export const arrayHasValue = <O>(array: O[], value: O): boolean => {
    return array.indexOf(value) > -1;
};

export const arrayHasObjectId = (array: any[], value: any): boolean => {
    for (const obj of array) {
        if (obj.equals(value)) {
            return true;
        }
    }

    return false;
};

export const getIndexOfValue = (array: any[], value: any): number => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].equals(value)) {
            return i;
        }
    }

    return -1;
};

export const removeDuplicates = <O>(array: O[]): O[] => {
    return array.filter((value, index) => array.indexOf(value) === index);
};