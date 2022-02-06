import Web3 from 'web3';
import { ropstenNetwork, GAS_PRICE } from '../constants/general.constants';
import InsufficientGasException from '../exceptions/insufficientGas.exception';
import { ITransactionConfig } from '../interfaces/blockchain.interface';

class TransactionService {
    private static instance: TransactionService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;

    constructor() {
        // Create web3 instance
        this.web3 = new Web3(new Web3.providers.HttpProvider(ropstenNetwork(process.env.INFURA_PROJECT_ID)));
    }

    static getInstance = () => {
        if (!TransactionService.instance) {
            TransactionService.instance = new TransactionService();
        }
        return TransactionService.instance;
    };

    createTransaction = async (
        to: string,
        from: string,
        data: string, 
        gasLimit: number
    ): Promise<ITransactionConfig> => {
        const nonce = await this.web3.eth.getTransactionCount(this.deploymentAddress!);

        const gasPriceHex = this.web3.utils.toHex(this.web3.utils.toWei(GAS_PRICE, 'gwei'));
        const gasLimitHex = this.web3.utils.toHex(gasLimit);

        const tx: ITransactionConfig = {
            nonce: nonce, // this.web3.utils.toHex(nonce), // TODO - Check!!
            gasPrice: gasPriceHex,
            gas: gasLimitHex,
            from: from,
            to: to,
            value: 0,
            data: data
        };

        return tx;
    }

    signAndSendTransaction = async (
        tx: ITransactionConfig, 
        isDeploy: boolean = false
    ): Promise<string | void | undefined> => {
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
                throw new InsufficientGasException(this.deploymentAddress);
            });
    }
}

export default TransactionService;
