
// Allows implementation of static methods in interfaces
function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}