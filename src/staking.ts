// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetType} from '@collabland/chain';
import {getEnvVar} from '@collabland/common';
import {inject} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {ETHERS_PROVIDER_SERVICE} from './keys.js';
import {StakingAsset} from './models/staking.model.js';

export {StakingAsset, StakingContractMetadata} from './models/staking.model.js';

export interface EthersProviderService {
  getProvider(chainIdOrNetwork: string | number): providers.Provider;
}

/**
 * Interface to be implemented to support specific staking contracts
 */
export interface StackingContractAdapter {
  contractName?: string;
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
   * Check if the given asset name is supported by this staking contract
   * @param asset - Asset name such as `ERC721:0x...`
   */
  isAssetSupported(assetName: string): Promise<boolean>;

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
    if (chainId.toString() === '56') {
      return new providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    }
    if (chainId.toString() === '81457') {
      return new providers.JsonRpcProvider('https://rpc.blast.io');
    }
    const projectId =
      getEnvVar('INFURA_PROJECT_ID') ?? getEnvVar('STAKING_INFURA_PROJECT_ID');
    const projectSecret = getEnvVar('INFURA_PROJECT_SECRET');
    if (projectId == null) {
      return providers.getDefaultProvider(chainId);
    } else {
      return new providers.InfuraProvider(chainId, {projectId, projectSecret});
    }
  },
};

/**
 * Base class for staking contract adapters
 */
export abstract class BaseStakingContractAdapter
  implements StackingContractAdapter
{
  contractName?: string | undefined;

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

  async isAssetSupported(assetName: string): Promise<boolean> {
    return this.supportedAssets.some(
      a => a.asset.toLowerCase() === assetName.toLowerCase(),
    );
  }

  getStakingAsset(nameOrAssetType?: string) {
    const assetType = nameOrAssetType?.toLowerCase();
    let asset = this.supportedAssets.find(
      a =>
        a.name?.toLowerCase() === assetType ||
        a.asset.toLowerCase() === assetType,
    );
    if (asset != null) return asset;
    // Find the asset that doesn't have a name
    asset = this.supportedAssets.find(a => a.name == null);
    if (asset != null) return asset;
    return this.supportedAssets[0];
  }

  getStakingAssetType(name?: string) {
    const asset = this.getStakingAsset(name);
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

  async getStakedTokenIds(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]> {
    return [];
  }
}
