import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {OmniguardEternals__factory} from '../types/factories/OmniguardEternals__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class OmniguardsStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x02B3b9900F829C9C392fBa0C4bb450becdFE7374';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x6F7fe413E871B80C5A12C180F5aB3964f82D5cDc',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = OmniguardEternals__factory.connect(
      this.contractAddress,
      this.provider,
    );
    // Pool id = 1 for `0x6F7fe413E871B80C5A12C180F5aB3964f82D5cDc`
    const info = await contract.getStakerInfo(owner, 1);
    return info[1];
  }
}
