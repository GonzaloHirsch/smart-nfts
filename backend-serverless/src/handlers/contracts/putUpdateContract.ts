import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EXTENSIONS } from '../../constants/contract.constants';
import { CustomContract } from '../../contracts/custom.contract';
import { Pausable } from '../../contracts/Pausable.contract';
import TemplateService from '../../services/template.service';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (
    !event.pathParameters ||
    event.pathParameters.contractId === null ||
    event.pathParameters.contractId === undefined ||
    event.pathParameters.contractId.trim().length === 0
  )
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing contract id'
      })
    };
  else if (event.body === null)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing request body'
      })
    };
  const requestBody = JSON.parse(event.body);
  console.log(requestBody);
  

  const contract = new CustomContract(
    Pausable.getExtensionOZImports(),
    'MyToken',
    'PF',
    [EXTENSIONS.PAUSABLE],
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
