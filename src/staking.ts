// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName, AssetType} from '@collabland/chain';
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

  /**
   * Get a list of asset types that can be staked to the contract
   * @param provider - Ethers provider
   */
  getStakingAssetType(
    provider: providers.Provider,
    name?: string,
  ): Promise<AssetType>;

  /**
   * Get a list token ids staked by the owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @param assetName - Asset name
   */
  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]>;

  /**
   * Get number of token ids staked by the owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @param assetName - Asset name
   */
  getStakedTokenBalance(
    provider: providers.Provider,
    owner: string,
    assetName?: string,
  ): Promise<BigNumber>;
}

export abstract class BaseStakingContractAdapter
  implements StackingContractAdapter
{
  chainId = 1;
  contractAddress: string;

  abstract getStakingAsset(
    provider: providers.Provider,
    name?: string,
  ): Promise<AssetName>;

  async getStakingAssetType(
    provider: providers.Provider,
    name?: string,
  ): Promise<AssetType> {
    const assetName = await this.getStakingAsset(provider, name);
    return new AssetType({
      chainId: {
        namespace: 'evm',
        reference: this.chainId.toString(),
      },
      assetName,
    });
  }

  async getStakedTokenBalance(
    provider: providers.Provider,
    owner: string,
    assetName?: string,
  ): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(provider, owner, assetName);
    return BigNumber.from(ids.length);
  }

  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]> {
    throw new Error('Method not implemented.');
  }
}
