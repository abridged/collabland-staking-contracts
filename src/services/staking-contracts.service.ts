// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {debugFactory} from '@collabland/common';
import {
  BindingScope,
  ContextTags,
  extensions,
  injectable,
} from '@loopback/core';
import {utils} from 'ethers';
import {
  STAKING_ADAPTERS_EXTENSION_POINT,
  STAKING_CONTRACTS_SERVICE,
} from '../keys';
import {StackingContractAdapter, StakingContractMetadata} from '../staking';

const debug = debugFactory('collabland:staking-contracts');

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.KEY]: STAKING_CONTRACTS_SERVICE,
  },
})
export class StakingContractsService {
  constructor(
    @extensions.list(STAKING_ADAPTERS_EXTENSION_POINT)
    private adapters: StackingContractAdapter[],
  ) {}

  getStakingContracts(): StakingContractMetadata[] {
    return this.adapters.map(a => ({
      chainId: a.chainId ?? 1,
      contractAddress: utils.getAddress(a.contractAddress),
      supportedAssets: a.supportedAssets,
    }));
  }

  isStakingContract(address: string, chainId = 1) {
    address = utils.getAddress(address);
    return this.adapters.some(
      a =>
        (a.chainId ?? 1 === chainId) &&
        utils.getAddress(a.contractAddress) === address,
    );
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

  async getStakedTokenIds(
    owner: string,
    address: string,
    chainId = 1,
    assetName?: string,
  ) {
    const adapter = this.getAdapter(address, chainId);
    if (adapter == null) return undefined;
    try {
      const ids = await adapter.getStakedTokenIds(owner, assetName);
      debug(
        'Staked token ids from contract %s for account %s: %O',
        address,
        owner,
        ids,
      );
      return ids;
    } catch (err) {
      debug(
        'Fail to get staked token ids from contract %s for account %s',
        address,
        owner,
        err,
      );
      throw err;
    }
  }

  async getStakedTokenBalance(
    owner: string,
    address: string,
    chainId = 1,
    assetName?: string,
  ) {
    const adapter = this.getAdapter(address, chainId);
    if (adapter == null) return undefined;
    try {
      const balance = await adapter.getStakedTokenBalance(owner, assetName);
      debug(
        'Staked token balance from contract %s for account %s: %O',
        address,
        owner,
        balance,
      );
      return balance;
    } catch (err) {
      debug(
        'Fail to get staked token balance from contract %s for account %s',
        address,
        owner,
        err,
      );
      throw err;
    }
  }

  getStakingAssetType(address: string, chainId = 1, name?: string) {
    const adapter = this.getAdapter(address, chainId);
    if (adapter == null) return undefined;
    try {
      const assetType = adapter.getStakingAssetType(name);
      debug('Staking asset types from contract %s: %O', address, assetType);
      return assetType;
    } catch (err) {
      debug('Fail to get staking asset types from contract %s', address, err);
      throw err;
    }
  }
}
