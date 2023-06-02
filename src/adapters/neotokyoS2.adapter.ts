import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {NeotokyoStaker__factory} from '../types/factories/NeotokyoStaker__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class NeoTokyoS2ContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '<todo staker address>';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:<todo S1 address>',
    },
    {
      asset: 'ERC721:<todo S2 address>',
    }
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = NeotokyoStaker__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakerPosition(owner, 1);
  }
}
