import { IHttpErrorData } from "../interfaces/error.interface";

export const HTTP_ERRORS = {
    BAD_REQUEST: {
        GENERAL: { status: 400, internalStatus: 'BAD_REQUEST', message: 'Bad request.' },
        PARAMS: { status: 400, internalStatus: 'INVALID_PARAMS', message: 'Invalid parameters.' },
        CONTRACT: { status: 400, internalStatus: 'INVALID_CONTRACT', message: 'Invalid contract. Data missing.' },
    },
    FORBIDDEN: {
        GENERAL: { status: 403, internalStatus: 'FORBIDDEN', message: 'Forbidden.' },
    },
    NOT_FOUND: {
        GENERAL: { status: 404, internalStatus: 'NOT_FOUND', message: 'Not found.' },
        CONTRACT: { status: 404, internalStatus: "CONTACT_NF", message: 'Contract not found.' },
    },
    SERVER: {
        GENERAL: { status: 500, internalStatus: 'UNKNOWN_ERROR', message: 'Unknown server error.' },
        DATABASE: { status: 500, internalStatus: 'DB_ERROR', message: 'Database error.' },
        BLOCKCHAIN: { status: 500, internalStatus: 'BLOCKCHAIN_ERROR', message: 'Blockchain error.' },
        COMPILATION: { status: 500, internalStatus: 'COMPILATION_ERROR', message: 'Compilation error.' },
    },
};

export const EXCEPTION_NAMES = {
    CONTRACT_NOT_FOUND: 'ContractNotFoundException',
    VERIFICATION_FAILED: 'VerificationFailedException',
    INSUFFICIENT_GAS: 'InsufficientGasException',
    COMPILATION_ERROR: 'CompilationException',
}

export const EXCEPTION_TO_HTTP_MAP = new Map<string, IHttpErrorData>([
    [EXCEPTION_NAMES.CONTRACT_NOT_FOUND, HTTP_ERRORS.NOT_FOUND.CONTRACT],
    [EXCEPTION_NAMES.VERIFICATION_FAILED, HTTP_ERRORS.SERVER.BLOCKCHAIN],
    [EXCEPTION_NAMES.INSUFFICIENT_GAS, HTTP_ERRORS.SERVER.BLOCKCHAIN],
    [EXCEPTION_NAMES.COMPILATION_ERROR, HTTP_ERRORS.SERVER.COMPILATION],
]);