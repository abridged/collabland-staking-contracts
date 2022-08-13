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
  contractAddress = '0x2fBe96A414add128DB33C90a81Ed781f4dF14885';

  getStakedTokenIds(provider: Provider, owner: string): Promise<BigNumber[]> {
    const contract = RirsuStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    return contract.stakedRiris(owner);
  }
}
