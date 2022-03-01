import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import DeploymentService from '../../services/deployment.service';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';
import { recaptchaVerificationHandler } from '../../middleware/recaptchaVerificator.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)){
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }
    
    const instance = await StoredContractService.getInstance();

    let contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!)

    if (contract.digest === contract.deployment.digest) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.ALREADY_DEPLOYED);
    } else if (!(contract.compilation) || !(contract.compilation.bytecode)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.MISSING_COMPILATION);
    }
    
    contract = await DeploymentService.getInstance().deployContract(contract);

    return {
        statusCode: 200,
        body: JSON.stringify(contract.toJSON())
    };
};

export const handler = corsHandler('POST')(errorHandler()(recaptchaVerificationHandler()(headerVerificationHandler()(endpoint))));
