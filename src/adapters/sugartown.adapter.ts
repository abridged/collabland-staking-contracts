import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {SugartownStaking__factory} from '../types/factories/SugartownStaking__factory.js';

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

  async getStakedTokenIds(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]> {
    const balance = await this.getStakedTokenBalance(owner);
    // We don't know the token ids from the staking contract
    return new Array<BigNumber>(balance.toNumber()).fill(BigNumber.from(-1));
  }
}
