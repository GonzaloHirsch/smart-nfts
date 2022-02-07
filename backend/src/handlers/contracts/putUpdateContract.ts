import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EXTENSIONS } from '../../constants/contract.constants';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import HttpException from '../../exceptions/http.exception';
import { enumHasKeys } from '../../helpers/collection.helper';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, validContractId, isEmptyBody } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { IAttribute, IMetadata } from '../../interfaces/metadata.interface';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    else if (isEmptyBody(event.body)) 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing request body'));
    
    const requestBody = JSON.parse(event.body!);
    const name = requestBody.name as string;
    const symbol = requestBody.symbol as string;
    const extensions = requestBody.extensions as string[];
    const metadata = requestBody.metadata as IMetadata;

    if (!name || !symbol || !extensions || !enumHasKeys(EXTENSIONS, extensions)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    // Find contract in the DB
    const instance = await StoredContractService.getInstance();

    const {contract, contractString} = await instance.updateContract(
        event.pathParameters!.contractId!, 
        name, 
        symbol, 
        extensions as EXTENSIONS[],
        metadata
    );

    return {
        statusCode: 200,
        body: JSON.stringify({
        ...contract.toJSON(),
        contract: contractString
        })
    };
};

export const handler = corsHandler('PUT')(errorHandler()(endpoint));
