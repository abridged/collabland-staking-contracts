import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {SugartownStaking__factory} from '../types/factories/SugartownStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SugartownStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xd564C25B760cb278a55bDD98831f4ff4B6C97B38';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xd564C25B760cb278a55bDD98831f4ff4B6C97B38',
    },
  ];

  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = SugartownStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getUserStakedTokenCount(owner);
  }
}
