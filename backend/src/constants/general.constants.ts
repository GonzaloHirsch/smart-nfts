export const EXAMPLE = 'EXAMPLE';

export const baseURI = 'https://ipfs.io/ipfs/';
export const deployGas = 3000000;
export const mintGas = 300000;
export const baseUriGas = 35000;
export const transferGas = 40000;
export const gasPrice = '13'; // https://ethgasstation.info/ --> STANDARD

export const rinkebyNetwork = (projectId: string | undefined) => `https://rinkeby.infura.io/v3/${projectId}`;
export const rinkebyEtherscan = (type: string, hash: string) => `Etherscan: https://rinkeby.etherscan.io/${type}/${hash}`;
export const ropstenNetwork = (projectId: string | undefined) => `https://ropsten.infura.io/v3/${projectId}`;
export const ropstenEtherscan = (type: string, hash: string) => `Etherscan: https://ropsten.etherscan.io/${type}/${hash}`;
