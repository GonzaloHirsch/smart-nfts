import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import HttpException from '../../exceptions/http.exception';
import { isEmptyPathParams, validContractId, isEmptyBody } from '../../helpers/validations.helper';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId))
    throw new HttpException(400, '', 'Missing contract ID');
  else if (isEmptyBody(event.body)) throw new HttpException(400, '', 'Missing request body');
  // TODO: Check for input validity

  // Get contract by id, we need it
  const instance = await StoredContractService.getInstance();
  const contract = await instance.getContractById(event.pathParameters!.contractId!);
  // Verify not null
  if (contract === null) throw new HttpException(404, '', 'No contract with the given contract ID');

  // TODO: Do things with the contract

  return {
    statusCode: 201,
    body: JSON.stringify(contract.toJSON())
  };
};

export const handler = corsHandler('POST')(errorHandler()(endpoint));
