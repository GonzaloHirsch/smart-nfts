import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyBody, isEmptyPathParams, validContractId, typeValidations } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { ACCEPTED_LANGUAGES_MAP, ACCEPTED_LANGUAGES } from '../../constants/general.constants';
import { sendReminderEmail } from '../../helpers/email.helper';
import parser from 'accept-language-parser';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';
import { recaptchaVerificationHandler } from '../../middleware/recaptchaVerificator.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    } else if (isEmptyBody(event.body)) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing request body'));
    }

    // Get body
    const requestBody = JSON.parse(event.body!);
    const email = requestBody.email as string;

    // Make sure the contract exists
    const contract = await (await StoredContractService.getInstance()).getEnforcedContractById(event.pathParameters!.contractId!);
    if (contract.reminder && contract.reminder.date) {
        // Initial diff is in millis, get diff in hours
        let diff = (new Date().getTime() - contract.reminder.date.getTime()) / (1000 * 60 * 60);
        if (diff < 8) {
            throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.GENERAL, `Must wait at least ${(8 - diff).toFixed(1)} hours to send a new reminder`));
        }
    }
    
    // Detect the user language from the request
    const languages = parser.parse(event.headers['Accept-Language'])
    let selectedLanguage: string | undefined = undefined;
    languages.forEach(lang => {
        if (ACCEPTED_LANGUAGES_MAP[lang.code] && !selectedLanguage) {
            selectedLanguage = lang.code;
        }
    })

    // Validate body input
    if (!email || !typeValidations.email(email)) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing or invalid email address'));
    }

    // Send email
    await sendReminderEmail(email, event.pathParameters!.contractId!, selectedLanguage);

    // Update internal status
    contract.reminder.date = new Date();
    contract.reminder.language = selectedLanguage ?? ACCEPTED_LANGUAGES.EN;
    contract.markModified('reminder');
    await contract.save();
    return {
        statusCode: 204,
        body: JSON.stringify({})
    };
};

export const handler = corsHandler('POST')(errorHandler()(recaptchaVerificationHandler()(headerVerificationHandler()(endpoint))));
