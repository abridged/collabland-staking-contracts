import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';

import {SuperverseStaking__factory} from '../types/factories/SuperverseStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SuperverseStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x8C96EdC82d111E3c5686F5ABE738A82d54d0b887';

  /**
   * Assets that can be staked to this contract: SuperVerse ERC20
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'SuperVerse',
      asset: 'ERC20:0xe53EC727dbDEB9E2d5456c3be40cFF031AB40A55',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = SuperverseStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );

    const stakerInfo = await contract.stakerInfo(owner);
    return stakerInfo.stakerPower;
  }
}
