import Web3 from 'web3';
import { ropstenNetwork, deployGas, gasPrice } from '../constants/general.constants';
import InsufficientGasException from '../exceptions/insufficientGas.exception';

class DeploymentService {
  private static instance: DeploymentService;
  private web3;
  private deploymentAddress = process.env.DEPLOYMENT_ADDRESS;

  constructor() {
    // Create web3 instance
    this.web3 = new Web3(new Web3.providers.HttpProvider(ropstenNetwork(process.env.INFURA_PROJECT_ID)));
  }

  static getInstance = () => {
    if (!DeploymentService.instance) {
      DeploymentService.instance = new DeploymentService();
    }
    return DeploymentService.instance;
  };

  public deployContract = async (abi: any, bytecode: string): Promise<string | void | undefined> => {
    // Create contract instance
    const contract = new this.web3.eth.Contract(abi);
    // Deploy the contract w/promise
    const contractData = await contract
      .deploy({
        data: bytecode
      })
      .encodeABI();

    const tx = await this._createTransaction(contractData, deployGas);

    return await this._signAndSendTransaction(tx, true);
  };

  private async _createTransaction(data: string, gasLimit: number) {
    const nonce = await this.web3.eth.getTransactionCount(this.deploymentAddress!);

    const gasPriceHex = this.web3.utils.toHex(this.web3.utils.toWei(gasPrice, 'gwei'));
    const gasLimitHex = this.web3.utils.toHex(gasLimit);

    const tx = {
      nonce: this.web3.utils.toHex(nonce),
      gasPrice: gasPriceHex,
      gas: gasLimitHex,
      from: this.deploymentAddress,
      // No to: because we are deploying a contract
      value: 0,
      data: data
    };

    return tx;
  }

  private async _signAndSendTransaction(tx: any, isDeploy = false): Promise<string | void | undefined> {
    const signPromise = this.web3.eth.accounts.signTransaction(tx, process.env.DEPLOYMENT_PRIVATE_KEY!);

    return signPromise
      .then((signedTx) => {
        const sentTx = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction!);
        return sentTx;
      })
      .then((receipt) => {
        if (isDeploy) {
          return receipt.contractAddress;
        }
      })
      .catch((err) => {
        throw new InsufficientGasException("Insufficient gas");
      });
  }
}

export default DeploymentService;
