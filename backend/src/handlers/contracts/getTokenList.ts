import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import InteractionService from '../../services/interaction.service';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const instance = await StoredContractService.getInstance();

    const contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!)

    await InteractionService.getInstance(contract.deployment.network).listTokensOfOwner(contract);

    return {
        statusCode: 200,
        body: ''
    };
};

export const handler = corsHandler('GET')(errorHandler()(endpoint));
