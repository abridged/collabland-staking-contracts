// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetType} from '@collabland/chain';
import {getEnvVar} from '@collabland/common';
import {inject} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {ETHERS_PROVIDER_SERVICE} from './keys';

export interface EthersProviderService {
  getProvider(chainIdOrNetwork: string | number): providers.Provider;
}

export interface StakingAsset {
  /**
   * Optional name for the staking asset (required if multiple assets are supported)
   */
  name?: string;
  /**
   * CAIP asset name, such as `ERC721:<0x...>`
   */
  asset: string;
}

/**
 * Staking contract information
 */
export interface StakingContractMetadata {
  /**
   * Staking contract address
   */
  contractAddress: string;
  /**
   * Chain id
   */
  chainId: number;
  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[];
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
   * Supported assets to be staked
   */
  supportedAssets: StakingAsset[];

  /**
   * Get asset type that can be staked to the contract
   * @param assetName - Name of the asset if the staking contract allows multiple
   * types of tokens to be staked
   */
  getStakingAssetType(assetName?: string): AssetType | undefined;

  /**
   * Get a list token ids staked by the owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @param assetName - Asset name
   */
  getStakedTokenIds(owner: string, assetName?: string): Promise<BigNumber[]>;

  /**
   * Get number of token ids staked by the owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @param assetName - Asset name
   */
  getStakedTokenBalance(owner: string, assetName?: string): Promise<BigNumber>;
}

const defaultEthersProviderService = {
  getProvider(chainId: string | number) {
    return new providers.InfuraProvider(chainId, {
      projectId: getEnvVar('INFURA_PROJECT_ID'),
      projectSecret: getEnvVar('INFURA_PROJECT_SECRET'),
    });
  },
};

/**
 * Base class for staking contract adapters
 */
export abstract class BaseStakingContractAdapter
  implements StackingContractAdapter
{
  @inject(ETHERS_PROVIDER_SERVICE, {optional: true})
  providerService: EthersProviderService = defaultEthersProviderService;

  chainId = 1;
  contractAddress: string;

  abstract supportedAssets: StakingAsset[];

  private _provider: providers.Provider;

  get provider(): providers.Provider {
    if (this._provider) return this._provider;
    this._provider = this.providerService.getProvider(this.chainId);
    return this.provider;
  }

  getStakingAssetType(name?: string) {
    let asset = this.supportedAssets.find(a => a.name === name);
    if (asset == null) {
      asset = this.supportedAssets.find(a => a.name == null);
      if (asset == null) {
        asset = this.supportedAssets[0];
      }
    }
    if (asset == null) return undefined;
    return new AssetType({
      chainId: {
        namespace: 'evm',
        reference: this.chainId.toString(),
      },
      assetName: asset.asset,
    });
  }

  async getStakedTokenBalance(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(owner, assetName);
    return BigNumber.from(ids.length);
  }

  abstract getStakedTokenIds(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]>;
}
