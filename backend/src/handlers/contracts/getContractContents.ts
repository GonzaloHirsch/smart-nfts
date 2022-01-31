import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import StoredContractService from '../../services/storedContract.service';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import { generateContractZip } from '../../helpers/compression.helper';
import GenericException from '../../exceptions/generic.exception';
import { HTTP_ERRORS } from '../../constants/errors.constants';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) {
        throw new GenericException(HTTP_ERRORS.BAD_REQUEST.PARAMS);
    }

    const instance = await StoredContractService.getInstance();

    const {contract, contractString} = await instance.getContractContentsById(event.pathParameters!.contractId!)

    // Return no content if the contract hasn't been edited
    if (contractString == null) {
        return {
            statusCode: 204,
            body: ''
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/zip, application/octet-stream',
            'Content-disposition': `attachment; filename=${contract.name}-contract-${Date.now()}.zip`
        },
        body: generateContractZip(contractString).toString('base64'),
        isBase64Encoded: true
    };
};

export const handler = corsHandler('GET')(errorHandler()(endpoint));
