import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import HttpException from '../../exceptions/http.exception';
import StoredContractService from '../../services/storedContract.service';
import { EXTENSIONS } from '../../constants/contract.constants';
import CreationService from '../../services/creation.service';
import { isEmptyPathParams, validContractId } from '../../helpers/validations.helper';
import { generateContractZip } from '../../helpers/compression.helper';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId))
    throw new HttpException(400, '', 'Missing contract ID');

  // Find contract in the DB
  const instance = await StoredContractService.getInstance();
  const contract = await instance.getContractById(event.pathParameters!.contractId!);
  // Verify not null
  if (contract === null) throw new HttpException(404, '', 'No contract with the given contract ID');

  // Generate the contract itself if it has been edited
  let contractString = null;
  if (contract.name) {
    contractString = CreationService.getInstance().genContract(contract.name, contract.symbol, [...contract.extensions] as EXTENSIONS[]);
  }
  // Return no content if the contract hasn't been edited
  else {
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
