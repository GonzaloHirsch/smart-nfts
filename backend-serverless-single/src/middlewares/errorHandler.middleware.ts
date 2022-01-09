import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http.exception';
 
const ErrorHandlerMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction): void => {
  const status = error.status || 500;
  const internalStatus = error.internalStatus;
  const message = error.message || 'Server failed to answer';
  
  response
    .status(status)
    .send({
      internalStatus,
      message,
    });
}
 
export default ErrorHandlerMiddleware;
