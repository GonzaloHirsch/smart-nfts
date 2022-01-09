import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { writeFile } from 'fs';
import { EXTENSIONS } from '../../constants/contract.constants';
import { enumHasKeys } from '../../helpers/collection.helper';
import CreationService from '../../services/creation.service';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.body === null)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing request body'
      })
    };
  const requestBody = JSON.parse(event.body);
  const name = requestBody.name as string;
  const symbol = requestBody.symbol as string;
  const extensions = requestBody.extensions as string[];

  if (!name || !symbol || !extensions || !enumHasKeys(EXTENSIONS, extensions)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing request body'
      })
    };
  }

  try {
    const contractString = CreationService.getInstance().genContract(name, symbol, extensions as EXTENSIONS[]);

    writeFile('/tmp/test', contractString, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        contract: contractString
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal error'
      })
    };
  }
};
