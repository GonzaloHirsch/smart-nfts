import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import StoredContractService from '../../services/storedContract.service';
import InteractionService from '../../services/interaction.service';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';
import { recaptchaVerificationHandler } from '../../middleware/recaptchaVerificator.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    }

    const requestBody = JSON.parse(event.body!);
    const methodId = requestBody?.methodId as string;
    const inputs = requestBody?.inputs as IArguments;

    if (!requestBody || !methodId || !inputs) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const instance = await StoredContractService.getInstance();

    const contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!)

    const response = await InteractionService.getInstance(contract.deployment.network).handleMethodCall(contract, methodId, inputs)

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    };
};

export const handler = corsHandler('POST')(errorHandler()(recaptchaVerificationHandler()(headerVerificationHandler()(endpoint))));
