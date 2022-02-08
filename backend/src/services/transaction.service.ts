import { SUPPORTED_NETWORKS } from '../constants/contract.constants';
import Web3 from 'web3';
import { ropstenNetwork, GAS_PRICE, rinkebyNetwork } from '../constants/general.constants';
import InsufficientGasException from '../exceptions/insufficientGas.exception';
import { ITransactionConfig } from '../interfaces/blockchain.interface';
import NoNetworkException from '../exceptions/noNetwork.exception';

class TransactionService {
    private static instance: TransactionService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;

    constructor() {
        // Create web3 instance
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.getNetwork()!));
    }

    static getInstance = () => {
        if (!TransactionService.instance) {
            TransactionService.instance = new TransactionService();
        }
        return TransactionService.instance;
    };

    private getNetwork = (): string | undefined => {
        switch (process.env.DEPLOYMENT_NETWORK) {
            case SUPPORTED_NETWORKS.RINKEBY:
                return rinkebyNetwork(process.env.INFURA_PROJECT_ID);
            case SUPPORTED_NETWORKS.ROPSTEN:
                return ropstenNetwork(process.env.INFURA_PROJECT_ID);
        }
        throw new NoNetworkException(process.env.DEPLOYMENT_NETWORK);
    };

    createTransaction = async (
        data: string, 
        gasLimit: number,
        from: string,
        to?: string,
    ): Promise<ITransactionConfig> => {
        const nonce = await this.web3.eth.getTransactionCount(this.deploymentAddress!);

        const gasPriceHex = this.web3.utils.toHex(this.web3.utils.toWei(GAS_PRICE, 'gwei'));
        const gasLimitHex = this.web3.utils.toHex(gasLimit);

        const tx: ITransactionConfig = {
            nonce: nonce, // this.web3.utils.toHex(nonce), // TODO - Check!!
            gasPrice: gasPriceHex,
            gas: gasLimitHex,
            from: from,
            value: 0,
            data: data
        };

        if (to != null) {
            tx.to = to;
        }

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
