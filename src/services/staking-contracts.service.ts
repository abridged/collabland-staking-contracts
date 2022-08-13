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
import {providers} from 'ethers';
import {
  STAKING_ADAPTERS_EXTENSION_POINT,
  STAKING_CONTRACTS_SERVICE,
} from '../keys';
import {StackingContractAdapter} from '../staking';

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

  getStakingContractAddresses() {
    return this.adapters.map(a => a.contractAddress);
  }

  async getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    address: string,
    assetType?: string,
  ) {
    const adapter = this.adapters.find(a => a.contractAddress === address);
    if (adapter != null) {
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
  }
}
