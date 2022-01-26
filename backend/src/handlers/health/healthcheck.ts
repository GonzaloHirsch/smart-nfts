import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = {
    message: 'All services up and running! Welcome to Proyecto Final, a project by Gonzalo Hirsch and Florencia Petrikovich :)',
    walletAddress: process.env.DEPLOYMENT_ADDRESS,
    timestamp: new Date()
  };
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
}

export const handler = corsHandler("GET")(errorHandler()(endpoint));
