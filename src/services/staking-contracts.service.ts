// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  asCaipId,
  AssetName,
  AssetType,
  AssetTypeParams,
} from '@collabland/chain';
import {debugFactory, pMap} from '@collabland/common';
import {
  BindingScope,
  ContextTags,
  extensions,
  injectable,
} from '@loopback/core';
import {BigNumber, utils} from 'ethers';
import {
  STAKING_ADAPTERS_EXTENSION_POINT,
  STAKING_CONTRACTS_SERVICE,
} from '../keys.js';
import {StackingContractAdapter, StakingContractMetadata} from '../staking.js';

const debug = debugFactory('collabland:staking-contracts');

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.KEY]: STAKING_CONTRACTS_SERVICE,
  },
})
export class StakingContractsService {
  /**
   * Staking contracts
   */
  readonly stakingContracts: StakingContractMetadata[];
  constructor(
    @extensions.list(STAKING_ADAPTERS_EXTENSION_POINT)
    private adapters: StackingContractAdapter[],
  ) {
    this.stakingContracts = this.getStakingContracts();
  }

  private getStakingContracts(): StakingContractMetadata[] {
    return this.adapters.map(a => ({
      chainId: a.chainId ?? 1,
      contractAddress: utils.getAddress(a.contractAddress),
      supportedAssets: a.supportedAssets,
      contractName:
        a.contractName ??
        a.constructor.name.replace('StakingContractAdapter', ''),
    }));
  }

  /**
   * Check if a given contract address is a supported staking contract
   * @param contractAddress - Contract address
   * @param chainId - Chain id, default to `1`
   * @returns
   */
  isStakingContract(contractAddress: string, chainId = 1) {
    contractAddress = utils.getAddress(contractAddress);
    return this.adapters.some(
      a =>
        (a.chainId ?? 1) === chainId &&
        utils.getAddress(a.contractAddress) === contractAddress,
    );
  }

  getStakingAssetTypes(contractAddress: string, chainId = 1) {
    contractAddress = utils.getAddress(contractAddress);
    const adapters = this.adapters.filter(
      a =>
        (a.chainId ?? 1) === chainId &&
        utils.getAddress(a.contractAddress) === contractAddress,
    );
    if (adapters.length === 0) return [];
    const types = adapters[0].supportedAssets.map(a =>
      new AssetName(a.asset).namespace.toUpperCase(),
    );
    return Array.from(new Set(types));
  }

  /**
   * Find staking contracts that support the given asset type to be staked
   * @param assetType - CAIP asset type
   * @returns
   */
  findStakingContractByAssetType(assetType: string | AssetTypeParams) {
    const asset = asCaipId<AssetType>(assetType);
    const stakingContracts = this.getStakingContracts();
    return stakingContracts.filter(c => {
      c.supportedAssets.some(a => a.asset.toString() === asset.toString());
    });
  }

  private getAdapter(address: string, chainId = 1) {
    address = utils.getAddress(address);
    const adapter = this.adapters.find(
      a =>
        (a.chainId ?? 1 === chainId) &&
        utils.getAddress(a.contractAddress) === address,
    );
    if (adapter == null) return adapter;
    return adapter;
  }

  private async getAdaptersByAssetType(chainId = 1, assetName: string) {
    const adapters = this.adapters.filter(a => a.chainId ?? 1 === chainId);
    const list: StackingContractAdapter[] = [];
    for (const a of adapters) {
      const supported = await a.isAssetSupported(assetName);
      if (supported) {
        list.push(a);
      }
    }
    return list;
  }

  /**
   * Get staked token ids for the given asset type
   * @param owner - Owner address
   * @param chainId - Chain id
   * @param assetName - Asset name of the original token
   * @returns
   */
  async getStakedTokenIdsByAssetType(
    owner: string,
    chainId = 1,
    assetName: string,
  ) {
    const adapters = await this.getAdaptersByAssetType(chainId, assetName);
    const ids = await pMap(adapters, a => {
      return a.getStakedTokenIds(owner, assetName);
    });
    return ids.flat();
  }

  /**
   * Get staked token balance for the given asset type
   * @param owner - Owner address
   * @param chainId - Chain id
   * @param assetName - Asset name of the original token
   * @returns
   */
  async getStakedBalanceByAssetType(
    owner: string,
    chainId = 1,
    assetName: string,
  ) {
    const adapters = await this.getAdaptersByAssetType(chainId, assetName);
    const balances = await pMap(adapters, a => {
      return a.getStakedTokenBalance(owner, assetName);
    });
    let total = BigNumber.from(0);
    for (const bal of balances) {
      total = total.add(bal);
    }
    return total;
  }

  /**
   * Get a list of token ids staked by the owner
   * @param owner - Owner's wallet address
   * @param contractAddress - Contract address of the staking contract
   * @param chainId - Chain id, default to `1`
   * @param name - Optional name of the asset if the staking contract
   * supports multiple assets
   * @returns
   */
  async getStakedTokenIds(
    owner: string,
    contractAddress: string,
    chainId = 1,
    name?: string,
  ) {
    const adapter = this.getAdapter(contractAddress, chainId);
    if (adapter == null) return undefined;
    try {
      const ids = await adapter.getStakedTokenIds(owner, name);
      debug(
        'Staked token ids from contract %s for account %s: %O',
        contractAddress,
        owner,
        ids,
      );
      return ids;
    } catch (err) {
      debug(
        'Fail to get staked token ids from contract %s:%s for account %s',
        adapter.chainId,
        contractAddress,
        owner,
        err,
      );
      throw err;
    }
  }

  /**
   * Get the number of token ids staked by the owner
   * @param owner - Owner's wallet address
   * @param contractAddress - Contract address of the staking contract
   * @param chainId - Chain id, default to `1`
   * @param name - Optional name of the asset if the staking contract
   * supports multiple assets
   * @returns
   */
  async getStakedTokenBalance(
    owner: string,
    contractAddress: string,
    chainId = 1,
    name?: string,
  ) {
    const adapter = this.getAdapter(contractAddress, chainId);
    if (adapter == null) return undefined;
    try {
      const balance = await adapter.getStakedTokenBalance(owner, name);
      debug(
        'Staked token balance from contract %s for account %s: %O',
        contractAddress,
        owner,
        balance,
      );
      return balance;
    } catch (err) {
      debug(
        'Fail to get staked token balance from contract %s:%s for account %s',
        adapter.chainId,
        contractAddress,
        owner,
        err,
      );
      throw err;
    }
  }

  /**
   * Get the staking asset type for a given staking contract and asset name
   * @param contractAddress - Staking contract address
   * @param chainId - Chain id, default to `11
   * @param name - Optional name of the asset if the staking contract
   * supports multiple assets
   * @returns
   */
  getStakingAssetType(contractAddress: string, chainId = 1, name?: string) {
    const adapter = this.getAdapter(contractAddress, chainId);
    if (adapter == null) return undefined;
    try {
      const assetType = adapter.getStakingAssetType(name);
      debug(
        'Staking asset types from contract %s: %O',
        contractAddress,
        assetType,
      );
      return assetType;
    } catch (err) {
      debug(
        'Fail to get staking asset types from contract %s:%s',
        adapter.chainId,
        contractAddress,
        err,
      );
      throw err;
    }
  }
}
