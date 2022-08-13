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
  getStakingAssetTypes(provider: providers.Provider): Promise<AssetType[]>;

  /**
   * Get a list token ids staked by the owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @param assetType - Asset type
   */
  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    assetType?: string,
  ): Promise<BigNumber[]>;

  /**
   * Get number of token ids staked by the owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @param assetType - Asset type
   */
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

  abstract getStakingAsset(provider: providers.Provider): Promise<AssetName>;

  async getStakingAssetTypes(
    provider: providers.Provider,
  ): Promise<AssetType[]> {
    const assetName = await this.getStakingAsset(provider);
    return [
      new AssetType({
        chainId: {
          namespace: 'evm',
          reference: this.chainId.toString(),
        },
        assetName,
      }),
    ];
  }

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
