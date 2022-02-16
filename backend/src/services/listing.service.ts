import Web3 from 'web3';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { IEventData } from '../interfaces/blockchain.interface';
import { ITokenListing } from '../interfaces/general.interface';
import { EXTENSIONS } from '../constants/contract.constants';
import { NULL_ADDRESS, TOKENS_PER_PAGE } from '../constants/general.constants';
// Services
import TransactionService from './transaction.service';
// Exceptions
import BlockchainInteractException from '../exceptions/blockchainInteract.exception';
import ContractNotDeployedException from '../exceptions/contractNotDeployed.exception';

class ListingService {
    private static instance: ListingService;
    private web3;
    private deploymentAddress = process.env.DEPLOYMENT_ADDRESS!;

    constructor(network: string) {
        // Create web3 instance
        this.web3 = new Web3(new Web3.providers.HttpProvider(TransactionService.getNetwork(network)!));
    }

    static getInstance = (network: string) => {
        if (!ListingService.instance) {
            ListingService.instance = new ListingService(network);
        }
        return ListingService.instance;
    };

    listTokenOwners = async (
        storedContract: IStoredContract,
        page: number | null = 1,
        perPage: number | null = TOKENS_PER_PAGE
    ): Promise<ITokenListing> => {
        
        const deployment = storedContract.deployment;
        const start = (perPage ?? TOKENS_PER_PAGE) * ((page ?? 1) - 1);
        const end = (perPage ?? TOKENS_PER_PAGE) * (page ?? 1);

        if (deployment == null) {
            throw new ContractNotDeployedException(storedContract.id);
        }

        const contract = new this.web3.eth.Contract(
            deployment.abi as any, 
            deployment.address
        );
        
        // Filter from block 1 as per: https://ethereum.stackexchange.com/questions/71307/mycontract-getpasteventsallevents-returns-empty-array
        const eventData = await contract.getPastEvents('Transfer', { fromBlock: 1});

        // Sort from oldest to newest events => TODO - is this sorting necessary?
        const sortedEventData = eventData
            .sort(
                (a: IEventData, b: IEventData) =>
                    a.blockNumber - b.blockNumber ||
                    a.transactionIndex - b.transactionIndex,
                );

        const ownerListing: {[tokenId: string]: string} = {};
        const tokenListing: ITokenListing = {};
        
        // Get the owners for each token
        sortedEventData.forEach((event: IEventData) => {
            // TokenId of the event involved
            const tokenId = event.returnValues.tokenId;
            // Set the owner of the token as the last transfer to
            ownerListing[tokenId] = event.returnValues.to;
        });

        // Remove the tokens that have been burned (to = null address)
        const finalOwnerListing = Object.keys(ownerListing)
            .reduce((acc: {[tokenId: string]: string}, tokenId: string) => {
                if (ownerListing[tokenId] !== NULL_ADDRESS) {
                    acc[tokenId] = ownerListing[tokenId]
                }
                return acc;
            }, {});

        // Get the token ids that will be shown on the specified page
        const tokenIdsOfPage = Object.keys(finalOwnerListing)
            .filter((_: string, idx: number) => start <= idx && idx < end);

        await Promise.all(
            tokenIdsOfPage.map(async (tokenId: string) => {
                tokenListing[tokenId] = {
                    owner: finalOwnerListing[tokenId],
                }
                // Get the uri token if they have any
                if (deployment.extensions.includes(EXTENSIONS.ERC721URIStorage)) {
                    tokenListing[tokenId].uriHash = await contract.methods.tokenURI(tokenId)
                        .call({ from: this.deploymentAddress })
                        .catch((err: any) => {
                            console.log(err);
                            throw new BlockchainInteractException(err.message);
                        });
                }
            })
        );

        return tokenListing;


        /*
        Response format, array of:
        {
            "address":"0x3a39C6b963c70777d191601aE25C1966aDd85C41",
            "blockHash":"0xc8dc51489633a9690d5c0bf6e9ba749f829255b395d9290b891a7b318047e040",
            "blockNumber":10151752,
            "logIndex":0,
            "removed":false,
            "transactionHash":"0xd2f772a09a119df4cbb9ad6571538b1e05428f00869d4dba80867bbf7e212b41",
            "transactionIndex":1,
            "id":"log_523f23d4",
            "returnValues":{
                "0":"0x0000000000000000000000000000000000000000",
                "1":"0xA3D9E7D1c697EDB3C37d73200149b01749853ab4",
                "2":"2",
                "from":"0x0000000000000000000000000000000000000000",
                "to":"0xA3D9E7D1c697EDB3C37d73200149b01749853ab4",
                "tokenId":"2"
            },
            "event":"Transfer",
            "signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "raw":{
                "data":"0x",
                "topics":[
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "0x000000000000000000000000a3d9e7d1c697edb3c37d73200149b01749853ab4",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }
        },
        */
        
    //     const token = await ethers.getContractAt(ERC721.abi, tokenAddress, ethers.provider);
      
    //     console.error(await token.name(), 'tokens owned by', account);
      
    //     const sentLogs = await token.queryFilter(
    //       token.filters.Transfer(account, null),
    //     );
    //     const receivedLogs = await token.queryFilter(
    //       token.filters.Transfer(null, account),
    //     );
      
    //     const logs = sentLogs.concat(receivedLogs)
    //       .sort(
    //         (a, b) =>
    //           a.blockNumber - b.blockNumber ||
    //           a.transactionIndex - b.TransactionIndex,
    //       );
      
    //     const owned = new Set();
      
    //     for (const log of logs) {
    //       const { from, to, tokenId } = log.args;
          
    //       if (addressEqual(to, account)) {
    //         owned.add(tokenId.toString());
    //       } else if (addressEqual(from, account)) {
    //         owned.delete(tokenId.toString());
    //       }
    //     }
      
    //     console.log([...owned].join('\n'));
    };
}

export default ListingService;
