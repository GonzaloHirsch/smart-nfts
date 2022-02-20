const ETH_IN_WEI = Math.pow(10, 18);

// 1 eth == 10^18 wei
export const weiToEth = (wei: number): number => {
    return wei / ETH_IN_WEI;
};
