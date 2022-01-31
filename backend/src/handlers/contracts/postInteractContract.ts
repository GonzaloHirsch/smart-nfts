import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyPathParams, validContractId, isEmptyBody } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    else if (isEmptyBody(event.body)) 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing request body'));
    
    // TODO: Check for input validity

    // Get contract by id, we need it
    const instance = await StoredContractService.getInstance();
    const contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!);

    // TODO: Do things with the contract

    return {
        statusCode: 201,
        body: JSON.stringify(contract.toJSON())
    };
};

export const handler = corsHandler('POST')(errorHandler()(endpoint));
