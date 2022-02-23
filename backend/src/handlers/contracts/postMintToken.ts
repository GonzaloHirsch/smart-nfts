import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { parse } from 'aws-multipart-parser'
import StoredContractService from '../../services/storedContract.service';
import MintingService from '../../services/minting.service';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) { 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    }

    const formData = parse(event, true);

    if (formData.methodId == null) { 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing method ID'));
    }

    const instance = await StoredContractService.getInstance();

    const contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!)

    const response = await MintingService.getInstance().handleMintCall(contract, formData.methodId as string, formData);
    
    return {
        statusCode: 201,
        body: JSON.stringify(response)
    };
};

export const handler = corsHandler('POST')(errorHandler()(headerVerificationHandler()(endpoint)));
