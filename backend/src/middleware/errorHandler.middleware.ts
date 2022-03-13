import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { setHttpErrorMsg } from '../helpers/errors.helper';
import { EXCEPTION_TO_HTTP_MAP } from '../constants/errors.constants';
import HttpException from '../exceptions/http.exception';
import CustomException from '../exceptions/custom.exception';

// Reference https://github.com/dbartholomae/lambda-middleware/blob/main/packages/http-error-handler/src/ErrorHandler.ts
// Reference https://github.com/dbartholomae/lambda-middleware/blob/main/packages/utils/src/PromiseHandler.ts
/**
 * Function that doesn't receive anything, but returns a handler function exported for the Lambda layer
 * @returns
 */
export const errorHandler =
    () =>
    (handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>): ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            return await handler(event);
        } catch (err) {
            console.error(err);

            if (err instanceof HttpException) {
                const status = err.status || 500;

                return {
                    statusCode: status,
                    body: JSON.stringify({
                        internalStatus: err.internalStatus || (status < 500 ? 'CLIENT_ERROR' : 'SERVER_ERROR'),
                        message: err.message || 'Internal server error'
                    })
                };
            }
            // Custom errors
            else if (err instanceof CustomException && EXCEPTION_TO_HTTP_MAP.has(err.name)) {
                const httpError = setHttpErrorMsg(EXCEPTION_TO_HTTP_MAP.get(err.name)!, err.message);

                return {
                    statusCode: httpError.status,
                    body: JSON.stringify({
                        internalStatus: httpError.internalStatus,
                        message: err.message,
                        data: err.data
                    })
                };
            }

            // Unknown error
            return {
                statusCode: 500,
                body: JSON.stringify({
                    internalStatus: 'SERVER_ERROR',
                    message: 'Internal server error'
                })
            };
        }
    };
