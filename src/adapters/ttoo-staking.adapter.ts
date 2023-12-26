import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {TtooStaking__factory} from '../types/factories/TtooStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class TtooStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x60dA2a1F0693ea2f44F38421F7842a79bD3C9f14';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xF6ee484f82f28d69688f37fe90Af514ce212b7c3',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = TtooStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const data = await contract.getUserStakingInfo(owner);
    return data[0];
  }
}
