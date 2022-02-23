import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import RecaptchaVerificationService from '../../services/recaptchaVerificationService';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestBody = JSON.parse(event.body!);
    const token = requestBody?.token as string;

    if (!requestBody || !token) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }
    
    const verificationStatus = await RecaptchaVerificationService.getInstance().verifyToken(token);

    return {
        statusCode: 200,
        body: JSON.stringify(verificationStatus)
    };
};

export const handler = corsHandler('GET')(errorHandler()(headerVerificationHandler()(endpoint)));
