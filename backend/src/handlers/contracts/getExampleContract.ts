import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { writeFile } from 'fs';
import { EXTENSIONS } from '../../constants/contract.constants';
import { CustomContract } from '../../contracts/custom.contract';
import { Pausable } from '../../contracts/Pausable.contract';
import TemplateService from '../../services/template.service';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = {
      contract: ""
  };

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

  writeFile('/tmp/test', contractString, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });

  body.contract = contractString;

  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};
