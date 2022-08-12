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
          tokens[address] = ids;
        } catch (err) {
          // Ignore
        }
      }
    }
    return tokens;
  }
}
