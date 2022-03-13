
// Allows implementation of static methods in interfaces
export const staticImplements = <T>() => {
    return <U extends T>(constructor: U) => constructor;
}