import { flattenContract } from '../helpers/compiler.helper';
import { IStoredContract } from '../models/storedContract.model';
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';
import VerificationDuplicationException from '../exceptions/verificationDuplication.exception';
import axios, { AxiosRequestConfig } from 'axios';
import VerificationFailedException from '../exceptions/verificationFailed.exception';
import qs from 'qs';
import EtherscanErrorException from '../exceptions/etherscanError.exception';
import { weiToEth } from '../helpers/units.helper';

class EtherscanService {
    private static instance: EtherscanService;

    static getInstance = () => {
        if (!EtherscanService.instance) {
            EtherscanService.instance = new EtherscanService();
        }
        return EtherscanService.instance;
    };

    public verifyDeployedContract = async (contract: IStoredContract, contractString: string): Promise<IStoredContract> => {
        if (!contract.deployment || !contract.deployment.address) {
            throw new ContractNotDeployedException(contract.id);
        } else if (contract.deployment && contract.verification.verified && contract.verification.verifiedAddress === contract.deployment.address) {
            throw new VerificationDuplicationException(contract.deployment.address);
        }

        // Flatten contract
        const flatContract = await flattenContract(contractString);

        // Verify the contract
        const verificationId = await this._verifyContract(
            flatContract,
            contract.name,
            contract.deployment.address,
            contract.deployment.compilerVersion,
            contract.deployment.network
        );

        // Updating the state
        contract.verification.verified = true;
        contract.verification.verifiedAddress = contract.deployment.address;
        contract.verification.date = new Date();
        contract.markModified('verification');
        await contract.save();

        return contract;
    };

    public getAddressBalance = async (address : string) : Promise<Number> => {
        const data = qs.stringify({
            apikey: `${process.env.ETHERSCAN_API_KEY}`,
            module: 'account',
            action: 'balance',
            address: address,
            tag: 'latest'
        });
        // Config for request as per what Postman says
        const config = this._getApiConfig(undefined);
        config.data = data;
        return await axios(config)
            .then((res) => {
                if (res.data.status === '0') throw new EtherscanErrorException();
                return weiToEth(res.data.result);
            })
            .catch((err) => {
                console.log(err);
                throw new EtherscanErrorException();
            });
        return 0;
    } 

    private _verifyContract = async (
        contract: string,
        contractName: string,
        contractAddress: string,
        compilerVersion: string,
        contractNetwork: string
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
        const config = this._getApiConfig(contractNetwork);
        config.data = data;
        // Making the request itself
        return await axios(config)
            .then((res) => {
                console.log(res);
                if (res.data.status === '0') throw new VerificationFailedException(contractAddress);
                return res.data.result;
            })
            .catch((err) => {
                console.log(err);
                throw new VerificationFailedException(contractAddress);
            });
    };

    private _getApiConfig = (network: string | undefined): AxiosRequestConfig => {
        let _network = network || process.env.DEPLOYMENT_NETWORK;
        const url = process.env.ETHERSCAN_API_URL?.replace('NETWORK', _network!);
        const config: AxiosRequestConfig = {
            method: 'post',
            url: `${url}api`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return config;
    };
}

export default EtherscanService;
