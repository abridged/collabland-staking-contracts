import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
// Use the full path to import instead of `../types`
import {DwebStaking__factory} from '../types/factories/DwebStaking__factory';

abstract class BaseDwebStakingContractAdapter extends BaseStakingContractAdapter {
  // Any assets is supported
  supportedAssets = [];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = DwebStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    try {
      return [(await contract.getStakeDetails(owner)).initialDeposit];
    } catch (err) {
      return [BigNumber.from(0)];
    }
  }
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class DwebEthereumStakingContractAdapter extends BaseDwebStakingContractAdapter {
  contractAddress = '0x7aA1f1A3c2BBfB7802313b6f18a2fc408A030564';
  chainId = 1;
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class DwebPolygonStakingContractAdapter extends BaseDwebStakingContractAdapter {
  contractAddress = '0x5DB2dE06eD6797E180cD432Ff0BeC6332a34C18E';
  chainId = 137;
}
