import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SatoshiStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xeDFdDb8eA41DEb967E75dc14Ff56A821B1Ef3306';

  /**
   * Assets that can be staked to this contract (satoshi nft)
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x978f7f915eB562d3819a82Daf4CEe01dD636C2D1',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const url = `https://api.ethernity.io/api/v2/satoshi-staking/${owner}/staked`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      // Assuming the API returns an array of token IDs
      // You might need to adjust the path to data depending on the actual response structure
      const tokenIds = res.data.items.map((item: {tokenId: string}) =>
        BigNumber.from(item.tokenId),
      );
      return tokenIds;
    } catch (error) {
      console.error('Error fetching staked token IDs:', error);
      throw error;
    }
  }
}
