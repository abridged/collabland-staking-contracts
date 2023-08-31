import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {PlutoallianceStaking__factory} from '../types/factories/PlutoallianceStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class PlutoallianceStakingAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x882eA36F2031F3EDD6Cc243472f6Bea7195ECaf3';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xDfe3AC769b2d8E382cB86143E0b0B497E1ED5447',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = PlutoallianceStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedTokens(owner);
  }
}
