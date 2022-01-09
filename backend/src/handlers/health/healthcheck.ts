import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = {
    message: 'All services up and running! Welcome to Proyecto Final, a project by Gonzalo Hirsch and Florencia Petrikovich :)'
  };
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};
