import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {W3ABPass__factory} from '../types/factories/W3ABPass__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class W3ABPassContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x45c06D92b9034b98bc458ac378e3DFA50D7aB188';
  chainId: number = 8453;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'W3AB Pass',
      asset: 'ERC721:0xb1E19FA955A5612B5D849e5c641F0B4cf9879d17',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = W3ABPass__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract
      .getStakeInfo(owner)
      .then(([tokensStaked]: [BigNumber[], BigNumber]) => {
        return tokensStaked; // Only return the first part of the tuple
      });
  }
}
