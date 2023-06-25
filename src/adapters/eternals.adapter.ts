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
export class EternalsStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x02B3b9900F829C9C392fBa0C4bb450becdFE7374';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xc26064Ac72101B555Ff2fCC1629a7A867B69c188',
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
    // Pool id = 0 for `0xc26064Ac72101B555Ff2fCC1629a7A867B69c188`
    const info = await contract.getStakerInfo(owner, 0);
    return info[1];
  }
}
