import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DatabaseService from '../../services/database.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  await DatabaseService.getInstance();
  return {
    statusCode: 200,
    body: JSON.stringify({
      contractId: 'fsdjgusdhg'
    })
  };
};

export const handler = errorHandler()(endpoint);
