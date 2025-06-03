import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {AcolytStaking__factory} from '../types/factories/AcolytStaking__factory.js';
// Use the full path to import instead of `../types`

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class AcolytStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xEE9808eee64586Db307A995dDCcb27769875E8b5';

  /**
   * The chain id
   */
  chainId = 8453;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0x79dacb99A8698052a9898E81Fdf883c29efb93cb',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = AcolytStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const balances = await contract.getStakedAmount(owner);
    return BigNumber.from(balances);
  }
}
