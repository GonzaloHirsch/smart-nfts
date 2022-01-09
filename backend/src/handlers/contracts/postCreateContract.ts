import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { writeFile } from 'fs';
import { EXTENSIONS } from '../../constants/contract.constants';
import { enumHasKeys } from '../../helpers/collection.helper';
import CreationService from '../../services/creation.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import HttpException from '../../exceptions/http.exception';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.body === null) throw new HttpException(400, '', 'Missing request body');
  const requestBody = JSON.parse(event.body);
  const name = requestBody.name as string;
  const symbol = requestBody.symbol as string;
  const extensions = requestBody.extensions as string[];

  if (!name || !symbol || !extensions || !enumHasKeys(EXTENSIONS, extensions)) throw new HttpException(400, '', 'Missing request body');

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
};

export const handler = errorHandler()(endpoint);
