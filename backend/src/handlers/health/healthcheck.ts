import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import EtherscanService from '../../services/etherscan.service';
import { headerVerificationHandler } from '../../middleware/headerHandler.middleware';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const address = process.env.DEPLOYMENT_ADDRESS;
  const eth = await EtherscanService.getInstance().getAddressBalance(address!);
  const body = {
    status: "OK",
    message: 'All services up and running! Welcome to Proyecto Final, a project by Gonzalo Hirsch and Florencia Petrikovich :)',
    wallet: {
      address: process.env.DEPLOYMENT_ADDRESS,
      balance: eth,
      network: process.env.DEPLOYMENT_NETWORK
    },
    timestamp: new Date()
  };
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
}

export const handler = corsHandler("GET")(errorHandler()(headerVerificationHandler()(endpoint)));
