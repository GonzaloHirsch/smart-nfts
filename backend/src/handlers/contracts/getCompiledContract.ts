import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { compileContract } from '../../helpers/compiler.helper';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const instance = await StoredContractService.getInstance();

    const {contract, contractString} = await instance.getContractContentsById(event.pathParameters!.contractId!)
    console.log(contractString)
    const compiledContract = compileContract(contractString!);

    return {
        statusCode: 200,
        body: JSON.stringify({compiledContract})
    };
};

export const handler = corsHandler('GET')(errorHandler()(headerVerificationHandler()(endpoint)));
