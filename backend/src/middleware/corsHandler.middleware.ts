import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const corsHandler =
  (allowedMethods: string) =>
  (handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>): ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) =>
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const response = await handler(event);
    const headers = response.headers || {};
    return {
      ...response,
      headers: {
        ...headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Expose-Headers': 'content-disposition'
      }
    };
  };
