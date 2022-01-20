class InsufficientGasException extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export default InsufficientGasException;