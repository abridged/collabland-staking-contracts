// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BigNumber, providers} from 'ethers';

export interface EthereumProviderFactory {
  getProvider(chainIdOrNetwork: string | number): providers.Provider;
}

export interface StakingContract {
  address: string;
  chainId: number;
}

export interface StackingContractAdapter {
  chainId?: number;
  contractAddress: string;

  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    assetType?: string,
  ): Promise<BigNumber[]>;

  getStakedTokenBalance(
    provider: providers.Provider,
    owner: string,
    assetType?: string,
  ): Promise<BigNumber>;
}

export abstract class BaseStakingContractAdapter
  implements StackingContractAdapter
{
  chainId = 1;
  contractAddress: string;

  async getStakedTokenBalance(
    provider: providers.Provider,
    owner: string,
    assetType?: string,
  ): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(provider, owner, assetType);
    return BigNumber.from(ids.length);
  }

  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    assetType?: string,
  ): Promise<BigNumber[]> {
    throw new Error('Method not implemented.');
  }
}
