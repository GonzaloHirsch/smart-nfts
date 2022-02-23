import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import GenericException from '../../exceptions/generic.exception';
import EtherscanService from '../../services/etherscan.service';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) 
    throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);

    const instance = await StoredContractService.getInstance();

    let {contract, contractString} = await instance.getContractContentsById(event.pathParameters!.contractId!);

    if (contractString == null) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.CONTRACT);
    }
    
    contract = await EtherscanService.getInstance().verifyDeployedContract(contract, contractString);

    return {
        statusCode: 200,
        body: JSON.stringify(contract.toJSON())
    };
};

export const handler = corsHandler('POST')(errorHandler()(headerVerificationHandler()(endpoint)));
