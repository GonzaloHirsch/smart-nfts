import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import RecaptchaVerificationFailedException from '../exceptions/recaptchaVerificationFailed.exception';
import { HEADERS } from '../constants/header.constants';
import MissingHeaderException from '../exceptions/missingHeader.exception';
import RecaptchaVerificationService from '../services/recaptchaVerificationService';

export const recaptchaVerificationHandler =
    () =>
    (handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>): ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const token = event.headers ? (event.headers[HEADERS.TOKEN] || event.headers[HEADERS.TOKEN_CAPITALIZED]) : undefined;
        if (!token) {
            console.log(event.headers);
            throw new MissingHeaderException(HEADERS.TOKEN);
        } 
        
        const verificationStatus = await RecaptchaVerificationService.getInstance().verifyToken(token);
        if (!(verificationStatus.success)) {
            console.error(verificationStatus);
            throw new RecaptchaVerificationFailedException();
        }

        return await handler(event);
    };
