import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { compileContract } from '../../helpers/compiler.helper';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';
import { recaptchaVerificationHandler } from '../../middleware/recaptchaVerificator.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const instance = await StoredContractService.getInstance();

    const {contractString} = await instance.getContractContentsById(event.pathParameters!.contractId!)

    const compiledContract = compileContract(contractString!);

    return {
        statusCode: 200,
        body: JSON.stringify({compiledContract})
    };
};

export const handler = corsHandler('GET')(errorHandler()(recaptchaVerificationHandler()(headerVerificationHandler()(endpoint))));
