import Web3 from 'web3';
import { SUPPORTED_NETWORKS } from '../constants/contract.constants';
import { ropstenNetwork, GAS_PRICE, rinkebyNetwork } from '../constants/general.constants';
import { ITransactionConfig } from '../interfaces/blockchain.interface';
import NoNetworkException from '../exceptions/noNetwork.exception';
import BlockchainInteractException from '../exceptions/blockchainInteract.exception';

class TransactionService {
    private static instance: TransactionService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;

    constructor(network: string) {
        // Create web3 instance
        this.web3 = new Web3(new Web3.providers.HttpProvider(TransactionService.getNetwork(network)!));
    }

    static getInstance = (network: string) => {
        if (!TransactionService.instance) {
            TransactionService.instance = new TransactionService(network);
        }
        return TransactionService.instance;
    };

    static getNetwork = (network: string): string | undefined => {
        switch (network) {
            case SUPPORTED_NETWORKS.RINKEBY:
                return rinkebyNetwork(process.env.INFURA_PROJECT_ID);
            case SUPPORTED_NETWORKS.ROPSTEN:
                return ropstenNetwork(process.env.INFURA_PROJECT_ID);
        }
        throw new NoNetworkException(network);
    };

    createTransaction = async (
        data: string, 
        gasLimit: number,
        from: string,
        to?: string,
    ): Promise<ITransactionConfig> => {
        const nonce = await this.web3.eth.getTransactionCount(this.deploymentAddress);

        const gasPriceHex = this.web3.utils.toHex(this.web3.utils.toWei(GAS_PRICE, 'gwei'));
        const gasLimitHex = this.web3.utils.toHex(gasLimit);

        const tx: ITransactionConfig = {
            nonce: nonce, // this.web3.utils.toHex(nonce),
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
            .then((signedTx) => this.web3.eth.sendSignedTransaction(signedTx.rawTransaction!))
            .then((receipt) => {
                if (isDeploy) {
                    return receipt.contractAddress;
                }
                return receipt.transactionHash;
            })
            .catch((err) => {
                console.log(err)
                throw new BlockchainInteractException(err.message, err.receipt);
            });
    }
}

export default TransactionService;
