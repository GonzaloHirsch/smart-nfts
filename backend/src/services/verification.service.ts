import { flattenContract } from '../helpers/compiler.helper';
import { IStoredContract } from '../models/storedContract.model';
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import VerificationDuplicationException from '../exceptions/verificationDuplication.exception';
import axios, { AxiosRequestConfig } from 'axios';
import VerificationFailedException from '../exceptions/verificationFailed.exception';
import qs from 'qs';

class VerificationService {
    private static instance: VerificationService;

    static getInstance = () => {
        if (!VerificationService.instance) {
            VerificationService.instance = new VerificationService();
        }
        return VerificationService.instance;
    };

    public verifyDeployedContract = async (
        contract: IStoredContract, 
        contractString: string
    ) : Promise<IStoredContract> => {

        if (!contract.deployment || !contract.deployment.address) {
            throw new ContractNotDeployedException(contract.id);
        } else if (contract.deployment && contract.verification.verified && contract.verification.verifiedAddress === contract.deployment.address) {
            throw new VerificationDuplicationException(contract.deployment.address);
        }
        
        // Flatten contract
        const flatContract = await flattenContract(contractString);
       
        // Verify the contract
        const verificationId = await this._verifyContract(flatContract, contract.name, contract.deployment.address, contract.deployment.compilerVersion);
       
        // Updating the state
        contract.verification.verified = true;
        contract.verification.verifiedAddress = contract.deployment.address;
        contract.verification.date = new Date();
        contract.markModified('verification');
        await contract.save();

        return contract;
    }

    private _verifyContract = async (
        contract: string, 
        contractName: string, 
        contractAddress: string, 
        compilerVersion: string
    ) => {
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
                if (res.data.status === '0') throw new VerificationFailedException(contractAddress);
                return res.data.result;
            })
            .catch((err) => {
                console.log(err)
                throw new VerificationFailedException(contractAddress);
            });
      };
      
}

export default VerificationService;
