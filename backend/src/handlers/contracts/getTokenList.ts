import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, isEmptyQueryParams, typeValidations, validContractId } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import ListingService from '../../services/listing.service';
import { TOKENS_PER_PAGE } from '../../constants/general.constants';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';
import { recaptchaVerificationHandler } from '../../middleware/recaptchaVerificator.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId) || isEmptyQueryParams(event.queryStringParameters)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const queryParams = event.queryStringParameters;

    // Check that params (if any) are valid numbers
    if (queryParams != null 
    && ((queryParams!.page != null && !typeValidations.number(queryParams!.page)) 
    || (queryParams!.perPage != null && !typeValidations.number(queryParams!.perPage)))) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const page = queryParams!.page == null ? 1 : parseInt(queryParams!.page as string);
    const perPage = queryParams!.perPage == null ? TOKENS_PER_PAGE : parseInt(queryParams!.perPage as string);

    const instance = await StoredContractService.getInstance();

    const contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!)

    const {pageCount, totalTokens, results} = await ListingService
        .getInstance(contract.deployment.network)
        .listTokenOwners(contract, page, perPage);

    const getUrl = (page: number, perPage: number) => `/contracts/${contract.id}/tokens?page=${page}&perPage=${perPage}`;

    return {
        statusCode: 200,
        body: JSON.stringify({
            _metadata: {
                page: page,
                perPage: perPage,
                pageCount: pageCount,
                totalCount: totalTokens,
                Links: {
                    self: getUrl(page, perPage),
                    first: page > 1 ? getUrl(1, perPage) : null,
                    previous: page > 1 ? getUrl(page - 1, perPage) : null,
                    next: page < pageCount ? getUrl(page + 1, perPage) : null,
                    last: page < pageCount ? getUrl(pageCount, perPage) : null,
                }
            },
            records: results
        })
    };
};

export const handler = corsHandler('GET')(errorHandler()(recaptchaVerificationHandler()(headerVerificationHandler()(endpoint))));
