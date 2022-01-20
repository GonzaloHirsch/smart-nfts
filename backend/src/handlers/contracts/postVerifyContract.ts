import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import CreationService from '../../services/creation.service';
import { flattenContract } from '../../helpers/compiler.helper';
import { verifyContract } from '../../helpers/verification.helper';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { EXTENSIONS } from '../../constants/contract.constants';
import HttpException from '../../exceptions/http.exception';
import VerificationFailedException from '../../exceptions/verificationFailed.exception';
import fs from 'fs';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (
    !event.pathParameters ||
    event.pathParameters.contractId === null ||
    event.pathParameters.contractId === undefined ||
    event.pathParameters.contractId.trim().length === 0
  )
    throw new HttpException(400, '', 'Missing contract ID');

  // Find contract in the DB
  const storedContractServiceInstance = await StoredContractService.getInstance();
  const contract = await storedContractServiceInstance.getContractById(event.pathParameters.contractId);
  // Verify not null
  if (contract === null) throw new HttpException(404, '', 'No contract with the given contract ID');
  else if (!contract.deployment || !contract.deployment.address) {
    throw new HttpException(400, '', 'Contract has not been deployed');
  } else if (contract.deployment && contract.verification.verified && contract.verification.verifiedAddress === contract.deployment.address) {
    throw new HttpException(400, '', 'Contract has already been verified');
  }

  // Generate the contract itself if it has been edited
  let contractString = null;
  if (contract.name) {
    contractString = CreationService.getInstance().genContract(contract.name, contract.symbol, [...contract.extensions] as EXTENSIONS[]);
  } else {
    throw new HttpException(400, '', 'Contract has not been edited');
  }

  // Compile the contract
  let verificationId;
  try {
    // Flatten it
    const flatContract = await flattenContract(contractString);
    // Verify the contract
    verificationId = await verifyContract(flatContract, contract.name, contract.deployment.address, contract.deployment.compilerVersion);
    // Updating the state
    contract.markModified("verification");
    contract.verification.verified = true;
    contract.verification.verifiedAddress = contract.deployment.address;
    contract.verification.date = new Date();
    await contract.save();
  } catch (err) {
    console.log(err)
    if (err instanceof VerificationFailedException) {
      throw new HttpException(500, '', 'Verification failed');  
    }
    throw new HttpException(500, '', 'Verification failed');
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      verificationId: verificationId
    })
  };
};

export const handler = corsHandler('POST')(errorHandler()(endpoint));
