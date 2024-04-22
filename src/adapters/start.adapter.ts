import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {Start__factory} from '../types/factories/Start__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class StartStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xB4A3C079ACBD57668bF5292C13878F9225678381';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'Saison 1',
      asset: 'ERC721:0x31b4C124E8e021402A2b89F8EC1AF54F68Fd256D',
    },
  ];

   /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
   getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = Start__factory.connect(
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
