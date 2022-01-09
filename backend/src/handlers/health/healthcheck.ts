import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = {
    message: 'All services up and running! Welcome to Proyecto Final, a project by Gonzalo Hirsch and Florencia Petrikovich :)'
  };
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
}

export const handler = errorHandler()(endpoint);
