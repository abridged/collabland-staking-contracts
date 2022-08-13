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
import {BigNumber, providers} from 'ethers';
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

  async getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    ...contractAddresses: string[]
  ) {
    const tokens: Record<string, BigNumber[]> = {};
    if (contractAddresses.length === 0) {
      contractAddresses = this.adapters.map(a => a.contractAddress);
    }
    for (const address of contractAddresses) {
      const adapter = this.adapters.find(a => a.contractAddress === address);
      if (adapter != null) {
        try {
          const ids = await adapter.getStakedTokenIds(provider, owner);
          debug(
            'Staked token ids from contract %s for account %s: %O',
            address,
            owner,
            ids,
          );
          tokens[address] = ids;
        } catch (err) {
          debug(
            'Fail to get staked token ids from contract %s for account %s',
            address,
            owner,
            err,
          );
          // Ignore
        }
      }
    }
    return tokens;
  }
}
