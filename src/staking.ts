import {BigNumber, providers} from 'ethers';

export interface StackingContractAdapter {
  contractAddress: string;

  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber[]>;
}
