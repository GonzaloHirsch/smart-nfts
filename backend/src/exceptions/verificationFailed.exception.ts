class VerificationFailedException extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export default VerificationFailedException;