// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {debugFactory, getEnvVar} from '@collabland/common';
import {
  BindingScope,
  ContextTags,
  extensions,
  inject,
  injectable,
} from '@loopback/core';
import {providers, utils} from 'ethers';
import {
  STAKING_ADAPTERS_EXTENSION_POINT,
  STAKING_CONTRACTS_SERVICE,
  STAKING_ETHEREUM_PROVIDER_FACTORY,
} from '../keys';
import {
  EthereumProviderFactory,
  StackingContractAdapter,
  StakingContract,
} from '../staking';

const debug = debugFactory('collabland:staking-contracts');

const defaultEthereumFactory = {
  getProvider(chainId: string | number) {
    return new providers.InfuraProvider(chainId, {
      projectId: getEnvVar('INFURA_PROJECT_ID'),
      projectSecret: getEnvVar('INFURA_PROJECT_SECRET'),
    });
  },
};

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
    @inject(STAKING_ETHEREUM_PROVIDER_FACTORY, {optional: true})
    private providerFactory: EthereumProviderFactory = defaultEthereumFactory,
  ) {}

  getStakingContracts(): StakingContract[] {
    return this.adapters.map(a => ({
      chainId: a.chainId ?? 1,
      address: utils.getAddress(a.contractAddress),
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
    if (adapter == null) return {adapter};

    const provider = this.providerFactory.getProvider(adapter.chainId ?? 1);
    return {adapter, provider};
  }

  async getStakedTokenIds(
    owner: string,
    address: string,
    chainId = 1,
    assetType?: string,
  ) {
    const {adapter, provider} = this.getAdapter(address, chainId);
    if (adapter == null) return undefined;
    try {
      const ids = await adapter.getStakedTokenIds(provider, owner, assetType);
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
    assetType?: string,
  ) {
    const {adapter, provider} = this.getAdapter(address, chainId);
    if (adapter == null) return undefined;
    try {
      const balance = await adapter.getStakedTokenBalance(
        provider,
        owner,
        assetType,
      );
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

  async getStakingAssetTypes(address: string, chainId = 1) {
    const {adapter, provider} = this.getAdapter(address, chainId);
    if (adapter == null) return undefined;
    try {
      const types = await adapter.getStakingAssetTypes(provider);
      debug('Staking asset types from contract %s: %O', address, types);
      return types;
    } catch (err) {
      debug('Fail to get staking asset types from contract %s', address, err);
      throw err;
    }
  }
}
