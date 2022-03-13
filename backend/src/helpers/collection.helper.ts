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
    return array.reduce((prev, curr) => prev.concat(curr), []);
};

// Sort method
export const getSortFn = <T>(condition: (input: T) => boolean) => {
    return (a: T, b: T) => {
        if (condition(a) === condition(b)) {
            return 0;
        } else if (condition(a)) {
            return -1;
        }
        return 1;
    };
};

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

export const arrayGetFirstMatch = <O>(array: O[], condition: (elem: O) => boolean): O | null => {
    for (const obj of array) {
        if (condition(obj)) {
            return obj;
        }
    }

    return null;
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
