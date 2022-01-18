import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EXTENSIONS } from '../../constants/contract.constants';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import HttpException from '../../exceptions/http.exception';
import { enumHasKeys } from '../../helpers/collection.helper';
import CreationService from '../../services/creation.service';
import StoredContractService from '../../services/storedContract.service';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (
    !event.pathParameters ||
    event.pathParameters.contractId === null ||
    event.pathParameters.contractId === undefined ||
    event.pathParameters.contractId.trim().length === 0
  )
    throw new HttpException(400, '', 'Missing contract ID');
  else if (event.body === null) throw new HttpException(400, '', 'Missing request body');

  const requestBody = JSON.parse(event.body);
  const name = requestBody.name as string;
  const symbol = requestBody.symbol as string;
  const extensions = requestBody.extensions as string[];

  if (!name || !symbol || !extensions || !enumHasKeys(EXTENSIONS, extensions)) throw new HttpException(400, '', 'Missing request body');

  // Find contract in the DB
  const instance = await StoredContractService.getInstance();
  const contract = await instance.getContractById(event.pathParameters.contractId);
  // Verify not null
  if (contract === null) throw new HttpException(404, '', 'No contract with the given contract ID');

  const extensionsCopy = [...extensions];
  // Generate the contract itself
  const contractString = CreationService.getInstance().genContract(name, symbol, extensions as EXTENSIONS[]);

  // Store the selection
  contract.name = name;
  contract.symbol = symbol;
  contract.extensions = extensionsCopy;
  await contract.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      contract: contractString
    })
  };
};

export const handler = corsHandler("PUT")(errorHandler()(endpoint));
