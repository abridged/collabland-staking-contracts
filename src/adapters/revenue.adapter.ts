import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {Revenue__factory} from '../types/factories/Revenue__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RevenueCoinStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xd5a5874c9328d955440cb26aed57bce3fb998c0f';
  chainId: number = 56;
  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0xbcbdecf8e76A5C32Dba69De16985882ace1678c6',
    },
  ];

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = Revenue__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const balance = BigNumber.from(0);
    for (let i = 0; i < 3; i++) {
      const amount = await contract.userInfo(i, owner);
      balance.add(amount.amount);
    }
    return balance;
  }
}
