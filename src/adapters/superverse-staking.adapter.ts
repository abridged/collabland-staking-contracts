import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js'

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
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0xe53EC727dbDEB9E2d5456c3be40cFF031AB40A55',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = SuperverseStaking__factory.connect(this.contractAddress, this.provider);
    return contract.stakerInfo(owner).then((stakerInfo)=> {
      return [stakerInfo.stakedTokens];
    }).catch(() => {
      console.log("failed")
      return [BigNumber.from(0)];
    });
  }
}
