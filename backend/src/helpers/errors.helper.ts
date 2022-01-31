import { IHttpErrorData } from "../interfaces/error.interface";

export const setHttpErrorMsg = (error: IHttpErrorData, msg: string) => {
    error.message = msg;
    return error;
}