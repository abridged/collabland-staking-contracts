import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {MoonrunnersStaking__factory} from '../types/factories/MoonrunnersStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class MoonrunnersStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x5aA6dD29ee52b700308f2C73C2B72BB656018609';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x1485297e942ce64e0870ece60179dfda34b4c625',
      name: 'Moonrunners',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = MoonrunnersStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const allStakedTokens = (await contract.getStake(owner)).tokenIds;
    // filter only moonrunners since dragon token ids have num 20_000 added to them
    return allStakedTokens.filter(tokenId =>
      tokenId.lt(BigNumber.from('20000')),
    );
  }
}
