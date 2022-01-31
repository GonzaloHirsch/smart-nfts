import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { setHttpErrorMsg } from '../helpers/errors.helper';
import { EXCEPTION_TO_HTTP_MAP } from '../constants/errors.constants';
import HttpException from '../exceptions/http.exception';

// Reference https://github.com/dbartholomae/lambda-middleware/blob/main/packages/http-error-handler/src/ErrorHandler.ts
// Reference https://github.com/dbartholomae/lambda-middleware/blob/main/packages/utils/src/PromiseHandler.ts
/**
 * Function that doesn't receive anything, but returns a handler function exported for the Lambda layer
 * @returns
 */
export const errorHandler = () =>
    (handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>): ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        
    try {

        return await handler(event);

    } catch (err) {

        if (err instanceof HttpException) {
            
            return {
                statusCode: err.status || 500,
                body: JSON.stringify({
                    message: err.message || 'Internal server error'
                })
            };
            
        } else if (err instanceof Error) {
            
            // Custom errors
            if (EXCEPTION_TO_HTTP_MAP.has(err.name)) {
                const httpError = setHttpErrorMsg(EXCEPTION_TO_HTTP_MAP.get(err.name)!, err.message);
                
                return {
                    statusCode: httpError.status,
                    body: JSON.stringify({
                        message: err.message
                    })
                };
            }
            
        }

        // Unknown error
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error'
            })
        };
    }
};
