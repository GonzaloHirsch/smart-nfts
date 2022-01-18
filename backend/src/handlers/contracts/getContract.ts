import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import HttpException from '../../exceptions/http.exception';
import StoredContractService from '../../services/storedContract.service';
import { EXTENSIONS } from '../../constants/contract.constants';
import CreationService from '../../services/creation.service';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (
    !event.pathParameters ||
    event.pathParameters.contractId === null ||
    event.pathParameters.contractId === undefined ||
    event.pathParameters.contractId.trim().length === 0
  )
    throw new HttpException(400, '', 'Missing contract ID');

  // Find contract in the DB
  const instance = await StoredContractService.getInstance();
  const contract = await instance.getContractById(event.pathParameters.contractId);
  // Verify not null
  if (contract === null) throw new HttpException(404, '', 'No contract with the given contract ID');

  // Generate the contract itself if it has been edited
  let contractString = null;
  if (contract.name) {
    contractString = CreationService.getInstance().genContract(contract.name, contract.symbol, contract.extensions as EXTENSIONS[]);
  }
    
  return {
    statusCode: 200,
    body: JSON.stringify({...contract.toJSON(), contract: contractString})
  };
};

export const handler = corsHandler('GET')(errorHandler()(endpoint));
