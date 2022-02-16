import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyBody, isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { typeValidations } from '../../helpers/validations.helper';
import { sendReminderEmail } from '../../helpers/email.helper';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    } else if (isEmptyBody(event.body)) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing request body'));
    }

    // Get body
    const requestBody = JSON.parse(event.body!);
    const email = requestBody.email as string;

    // Validate body input
    if (!email || !typeValidations.email(email)) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing or invalid email address'));
    }

    await sendReminderEmail(email, event.pathParameters!.contractId!);
    return {
        statusCode: 204,
        body: JSON.stringify({})
    };
};

export const handler = corsHandler('POST')(errorHandler()(endpoint));
