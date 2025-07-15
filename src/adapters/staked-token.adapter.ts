import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {Coco__factory} from '../types/factories/Coco__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class MyProjectStakingAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x97f15A410D285E562671f48c0AE2b5466deC0D39';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0xbf8ad72176bE24F2FFE80a1c6ad0faBe71799FCB',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = Coco__factory.connect(this.contractAddress, this.provider);
    return contract.getStakes(owner);
  }
}
