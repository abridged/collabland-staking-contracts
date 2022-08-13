// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName, AssetType} from '@collabland/chain';
import {BigNumber, providers} from 'ethers';

export interface EthereumProviderFactory {
  getProvider(chainIdOrNetwork: string | number): providers.Provider;
}

/**
 * Staking contract information
 */
export interface StakingContract {
  address: string;
  chainId: number;
}

/**
 * Interface to be implemented to support specific staking contracts
 */
export interface StackingContractAdapter {
  /**
   * Chain id for the staking contract, default to `1` (Ethereum Mainnet)
   */
  chainId?: number;

  /**
   * Contract address
   */
  contractAddress: string;

  /**
   * Get asset type that can be staked to the contract
   * @param provider - Ethers provider
   * @param assetName - Name of the asset if the staking contract allows multiple
   * types of tokens to be staked
   */
  getStakingAssetType(
    provider: providers.Provider,
    assetName?: string,
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

/**
 * Base class for staking contract adapters
 */
export abstract class BaseStakingContractAdapter
  implements StackingContractAdapter
{
  protected cachedAssetTypes = new Map<string, AssetType>();
  chainId = 1;
  contractAddress: string;

  /**
   * To be implemented by subclasses
   * @param provider - Ethers provider
   * @param name - Name of the staking token
   */
  abstract getStakingAsset(
    provider: providers.Provider,
    name?: string,
  ): Promise<AssetName>;

  async getStakingAssetType(
    provider: providers.Provider,
    name?: string,
  ): Promise<AssetType> {
    let assetType = this.cachedAssetTypes.get(name ?? '');
    if (assetType != null) return assetType;
    const assetName = await this.getStakingAsset(provider, name);
    assetType = new AssetType({
      chainId: {
        namespace: 'evm',
        reference: this.chainId.toString(),
      },
      assetName,
    });
    this.cachedAssetTypes.set(name ?? '', assetType);
    return assetType;
  }

  async getStakedTokenBalance(
    provider: providers.Provider,
    owner: string,
    assetName?: string,
  ): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(provider, owner, assetName);
    return BigNumber.from(ids.length);
  }

  abstract getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]>;
}
