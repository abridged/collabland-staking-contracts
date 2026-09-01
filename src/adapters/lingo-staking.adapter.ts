import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, ethers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {LingoStaking__factory} from '../index.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class LingoStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x9aF8C0dac726CcEE2BFd6c0f3E21f320d42398AC';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0xfb42Da273158B0F642F59F2Ba7cc1d5457481677',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = LingoStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const positions = await contract.getStakes(owner);

    let total = ethers.BigNumber.from(0);
    for (const pos of positions) {
      total = total.add(pos.amount);
    }

    return total;
  }
}
