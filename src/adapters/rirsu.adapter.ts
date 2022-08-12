import {Provider} from '@ethersproject/abstract-provider';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {StackingContractAdapter} from '../staking';
import {RirsuStaking__factory} from '../types/factories/RirsuStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RirsuStakingContractAdapter implements StackingContractAdapter {
  contractAddress = '0x5dACC3a466fD9E39DCCB2fabE0852285a76a2c59';

  getStakedTokenIds(provider: Provider, owner: string): Promise<BigNumber[]> {
    const contract = RirsuStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    return contract.stakedRiris(owner);
  }
}
