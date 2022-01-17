import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const contractService = await StoredContractService.getInstance();
  const contract = await contractService.createContract();
  return {
    statusCode: 200,
    body: JSON.stringify(contract)
  };
};

export const handler = errorHandler()(endpoint);
