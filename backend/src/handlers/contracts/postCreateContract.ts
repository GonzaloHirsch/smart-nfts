import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const contractService = await StoredContractService.getInstance();
    const contract = await contractService.createContract();
    return {
        statusCode: 201,
        body: JSON.stringify(contract.toJSON())
    };
};

export const handler = corsHandler("POST")(errorHandler()(headerVerificationHandler()(endpoint)));
