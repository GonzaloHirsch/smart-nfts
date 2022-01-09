
// Allows implementation of static methods in interfaces
export const staticImplements = <T>(): <U extends T>(constructor: U) => void => {
    return <U extends T>(constructor: U) => {constructor};
}