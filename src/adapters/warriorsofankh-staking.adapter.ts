import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {WarriorsOfankhStaking__factory} from '../types/factories/WarriorsofankhStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class WarriorsofankhStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x1931F7A8535219592E1756a1b187EE26565deE1a';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x3Fcbb0FDE70814D7f99B9E4126E9320b713B30f8',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = WarriorsOfankhStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedTokens(
      owner,
      '0x3Fcbb0FDE70814D7f99B9E4126E9320b713B30f8',
    );
  }
}
