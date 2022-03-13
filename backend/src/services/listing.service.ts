import Web3 from 'web3';
// Model
import { IStoredContract } from '../models/storedContract.model';
// Constants, interfaces, helpers
import { IEventData } from '../interfaces/blockchain.interface';
import { ITokenData, ITokenListing } from '../interfaces/general.interface';
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
        page: number = 1,
        perPage: number = TOKENS_PER_PAGE
    ): Promise<{pageCount: number, totalTokens: number, results: ITokenData[]}> => {
        
        const deployment = storedContract.deployment;
        const start = perPage * (page - 1);
        const end = perPage * page;

        if (deployment == null) {
            throw new ContractNotDeployedException(storedContract.id);
        }

        const contract = new this.web3.eth.Contract(
            deployment.abi as any, 
            deployment.address
        );
        
        // Filter from block 1 as per: https://ethereum.stackexchange.com/questions/71307/mycontract-getpasteventsallevents-returns-empty-array
        let eventData = await contract.getPastEvents('Transfer', { fromBlock: 1});

        // Sort from oldest to newest events, this sorting might not be necessary, but just in case
        // Event data is now sorted
        eventData = eventData
            .sort(
                (a: IEventData, b: IEventData) =>
                    a.blockNumber - b.blockNumber ||
                    a.transactionIndex - b.transactionIndex,
                );

        const ownerListing: {[tokenId: string]: string} = {};
        const tokenListing: ITokenListing = {};
        
        // Get the owners for each token
        eventData.forEach((event: IEventData) => {
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

        // Token count in all the contract
        const totalTokens = Object.keys(finalOwnerListing).length

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

        const results = Object.keys(tokenListing).map((tokenId: string) => {
            return {
                tokenId: tokenId,
                owner: tokenListing[tokenId].owner,
                uriHash: tokenListing[tokenId].uriHash
            }
        });

        return {
            pageCount: Math.ceil(totalTokens / perPage),
            totalTokens: totalTokens,
            results: results
        }

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
    };
}

export default ListingService;
