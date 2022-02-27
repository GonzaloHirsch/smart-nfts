export const hashString = (str: string) => {
    let hash = 0,
        i,
        chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export const removeAllButLast = (string: string, token: string): string => {
    /* Requires STRING not contain TOKEN */
    var parts = string.split(token);
    return parts.slice(0, -1).join('') + token + parts.slice(-1);
};
