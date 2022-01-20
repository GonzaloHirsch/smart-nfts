import axios, { AxiosRequestConfig } from 'axios';
import VerificationFailedException from '../exceptions/verificationFailed.exception';
import qs from 'qs';

export const verifyContract = async (contract: string, contractName: string, contractAddress: string, compilerVersion: string) => {
  // Create stringified version of the object
  const data = qs.stringify({
    apikey: `${process.env.ETHERSCAN_API_KEY}`,
    module: 'contract',
    action: 'verifysourcecode',
    contractaddress: contractAddress,
    codeformat: 'solidity-single-file',
    contractname: contractName,
    compilerversion: compilerVersion,
    optimizationUsed: 0,
    sourceCode: contract
  });
  // Config for request as per what Postman says
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `${process.env.ETHERSCAN_API_URL}api`,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  // Making the request itself
  return await axios(config)
    .then((res) => {
      console.log(res);
      if (res.data.status === '0') throw new VerificationFailedException('Verification failed');
      return res.data.result;
    })
    .catch(() => {
      throw new VerificationFailedException('Verification failed');
    });
};
