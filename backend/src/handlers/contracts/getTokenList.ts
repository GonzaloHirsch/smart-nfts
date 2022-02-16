import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, typeValidations, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import ListingService from '../../services/listing.service';
import { TOKENS_PER_PAGE } from '../../constants/general.constants';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const queryParams = event.queryStringParameters;

    // Check that params (if any) are valid numbers
    if (queryParams != null 
    && ((queryParams!.page != null && !typeValidations.number(queryParams!.page)) 
    || (queryParams!.perPage != null && !typeValidations.number(queryParams!.perPage)))) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const page = queryParams!.page == null ? null : parseInt(queryParams!.page as string);
    const perPage = queryParams!.perPage == null ? null : parseInt(queryParams!.perPage as string);

    const instance = await StoredContractService.getInstance();

    const contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!)

    const listing = await ListingService
        .getInstance(contract.deployment.network)
        .listTokenOwners(contract, page, perPage);

    return {
        statusCode: 200,
        body: JSON.stringify({listing})
    };
};

export const handler = corsHandler('GET')(errorHandler()(endpoint));
