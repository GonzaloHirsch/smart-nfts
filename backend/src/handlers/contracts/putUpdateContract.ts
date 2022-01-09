import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EXTENSIONS } from '../../constants/contract.constants';
import { CustomContract } from '../../contracts/custom.contract';
import { Pausable } from '../../contracts/Pausable.contract';
import TemplateService from '../../services/template.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import HttpException from '../../exceptions/http.exception';

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
  console.log(requestBody);

  const contract = new CustomContract(
    Pausable.getExtensionOZImports(),
    'MyToken',
    'PF',
    [EXTENSIONS.Pausable],
    Pausable.getExtensionLibs(),
    Pausable.getExtensionVariables(),
    Pausable.getExtensionMethods()
  );

  const contractString = TemplateService.getInstance().generateContract(contract);

  return {
    statusCode: 200,
    body: JSON.stringify({
      contract: contractString
    })
  };
};

export const handler = errorHandler()(endpoint);
