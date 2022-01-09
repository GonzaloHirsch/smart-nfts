import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import CreationService from '../../services/creation.service';
import { EXTENSIONS } from '../../constants/contract.constants';
import { compileContract } from '../../helpers/compiler.helper';
import { errorHandler } from '../../middleware/errorHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = {
    contract: ''
  };

  const extensions = ['AutoIncrementIds', 'Mintable'] as string[];

  const contractString = CreationService.getInstance().genContract('MyToken', 'PF', extensions as EXTENSIONS[]);

  compileContract(contractString);
  body.contract = contractString;
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};

export const handler = errorHandler()(endpoint);