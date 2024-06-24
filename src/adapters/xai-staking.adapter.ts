import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';

import {XaiPoolFactory__factory} from '../types/factories/XaiPoolFactory__factory.js';
import {XaiStakingPool__factory} from '../types/factories/XaiStakingPool__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class XaiStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5';

  /**
   * Assets that can be staked to this contract: SuperVerse ERC20
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'EsXai',
      asset: 'ERC20:0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c',
    },
  ];

  /**
   * Chain id for the staking contract, default to `1` (Ethereum Mainnet)
   */
  chainId = 42161;

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const poolFactoryContract = XaiPoolFactory__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const poolAddresses = await poolFactoryContract.getPoolIndicesOfUser(owner);

    if (poolAddresses.length === 0) {
      return BigNumber.from('0');
    }

    let accumulatedBalance = BigNumber.from('0');

    for (const poolAddress of poolAddresses) {
      const stakingPoolContract = XaiStakingPool__factory.connect(
        poolAddress,
        this.provider,
      );
      const stakerInfo = await stakingPoolContract.getStakedAmounts(owner);
      accumulatedBalance = accumulatedBalance.add(stakerInfo);
    }

    return accumulatedBalance;
  }
}
