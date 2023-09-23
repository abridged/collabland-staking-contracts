import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import { PrimordiaStaking__factory } from '../types/factories/PrimordiaStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class PrimordiaStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x9972EDCE48d82d16C82326e23f894f9aA0e3bb32';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xFbB87a6A4876820d996a9bbe106e4f73a5E4A71C',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns all the token ids staked by the user for that asset
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = PrimordiaStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.tokensOfOwner(owner);
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns the balance of that asset staked by the user
   */
  async getStakedTokenBalance(
    owner: string,
  ): Promise<BigNumber> {
    const contract = PrimordiaStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const allStakedTokens = await contract.tokensOfOwner(owner);
    return BigNumber.from(
      allStakedTokens.length,
    );
  }
}