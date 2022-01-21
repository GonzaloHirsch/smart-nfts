import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import StoredContractService from '../../services/storedContract.service';
import CreationService from '../../services/creation.service';
import DeploymentService from '../../services/deployment.service';
import { compileContract } from '../../helpers/compiler.helper';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { EXTENSIONS } from '../../constants/contract.constants';
import HttpException from '../../exceptions/http.exception';
import InsufficientGasException from '../../exceptions/insufficientGas.exception';

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

  // Generate the contract itself if it has been edited
  let contractString = null;
  if (contract.name) {
    contractString = CreationService.getInstance().genContract(contract.name, contract.symbol, [...contract.extensions] as EXTENSIONS[]);
  } else {
    throw new HttpException(400, '', 'Contract has not been edited');
  }

  // Compile the contract
  let contractAddress;
  try {
    // Compile contract
    const compiledContract = compileContract(contractString);
    
    // Deploy contract
    contractAddress = await DeploymentService.getInstance().deployContract(compiledContract.abi, compiledContract.bytecode);
    // Update inner state
    contract.abi = compiledContract.abi;
    contract.markModified("deployment");
    contract.deployment.address = contractAddress!;
    contract.deployment.date = new Date();
    contract.deployment.compilerVersion = compiledContract.compilerVersion;
    await contract.save();
  } catch (err) {
    if (err instanceof InsufficientGasException) {
      throw new HttpException(500, '', 'Insufficient gas to deploy contract');
    } else {
      throw new HttpException(500, '', 'Contract has errors');
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(contract.toJSON())
  };
};

export const handler = corsHandler('POST')(errorHandler()(endpoint));
