
// BLOCKCHAIN
export const NULL_ADDRESS = '0x0';

export const BASE_URI = 'https://ipfs.io/ipfs/';
export const DEPLOY_GAS = 10000000;
export const MINT_GAS = 3000000;
export const BASE_URI_GAS = 350000;
export const TRANSFER_GAS = 400000;
export const GAS_PRICE = '13'; // https://ethgasstation.info/ --> STANDARD

export const rinkebyNetwork = (projectId: string | undefined) => `https://rinkeby.infura.io/v3/${projectId}`;
export const rinkebyEtherscan = (type: string, hash: string) => `Etherscan: https://rinkeby.etherscan.io/${type}/${hash}`;
export const ropstenNetwork = (projectId: string | undefined) => `https://ropsten.infura.io/v3/${projectId}`;
export const ropstenEtherscan = (type: string, hash: string) => `Etherscan: https://ropsten.etherscan.io/${type}/${hash}`;
