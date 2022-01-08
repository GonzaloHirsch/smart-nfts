import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EXTENSIONS } from '../../constants/contract.constants';
import { Correct } from '../../contracts/Correct.contract';
import { CustomContract } from '../../contracts/custom.contract';
import { compileContract } from '../../helpers/compiler.helper';
import TemplateService from '../../services/template.service';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = {
    contract: ''
  };

  const contract = new CustomContract(
    Correct.getExtensionOZImports(),
    'MyToken',
    'PF',
    [EXTENSIONS.CORRECT],
    Correct.getExtensionLibs(),
    Correct.getExtensionVariables(),
    Correct.getExtensionMethods()
  );

  const contractString = TemplateService.getInstance().generateContract(contract);
  compileContract(contractString);
  body.contract = contractString;
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};
