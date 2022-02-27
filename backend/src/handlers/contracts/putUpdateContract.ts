import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EXTENSIONS, UPDATE_TYPES } from '../../constants/contract.constants';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { enumHasKeys } from '../../helpers/collection.helper';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, validContractId, isEmptyBody, isEmptyQueryParams } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { IMetadata } from '../../interfaces/metadata.interface';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';
import { recaptchaVerificationHandler } from '../../middleware/recaptchaVerificator.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId) || isEmptyQueryParams(event.queryStringParameters)) 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    else if (isEmptyBody(event.body)) 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing request body'));
    
    const requestBody = JSON.parse(event.body!);
    const name = requestBody.name as string;
    const symbol = requestBody.symbol as string;
    const extensions = requestBody.extensions as string[];
    const inputs = requestBody.inputs as string[] ?? {};
    const metadata = requestBody.metadata as IMetadata;
    const updateType = event.queryStringParameters!.updateType as string;

    if (!name || !symbol || !extensions || !enumHasKeys(EXTENSIONS, extensions) || !enumHasKeys(UPDATE_TYPES, [updateType])) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    // Find contract in the DB
    const instance = await StoredContractService.getInstance();

    const {contract, contractString} = await instance.updateContract(
        event.pathParameters!.contractId!, 
        name, 
        symbol, 
        extensions as EXTENSIONS[],
        inputs,
        metadata,
        updateType as UPDATE_TYPES
    );

    return {
        statusCode: 200,
        body: JSON.stringify({
        ...contract.toJSON(),
        contract: contractString
        })
    };
};

export const handler = corsHandler('PUT')(errorHandler()(recaptchaVerificationHandler()(headerVerificationHandler()(endpoint))));
