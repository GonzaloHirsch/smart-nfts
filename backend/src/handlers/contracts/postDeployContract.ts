import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import DeploymentService from '../../services/deployment.service';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)){
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }
    
    const instance = await StoredContractService.getInstance();

    let {contract, contractString} = await instance.getContractContentsById(event.pathParameters!.contractId!)

    if (contractString == null) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.CONTRACT);
    } else if (contract.digest === contract.deployment.digest) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.ALREADY_DEPLOYED);
    }
    
    contract = await DeploymentService.getInstance().deployContract(contract, contractString);

    return {
        statusCode: 200,
        body: JSON.stringify(contract.toJSON())
    };
};

export const handler = corsHandler('POST')(errorHandler()(headerVerificationHandler()(endpoint)));
