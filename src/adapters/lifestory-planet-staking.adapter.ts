import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {LifestoryPlanetStaking__factory} from '../types/factories/LifestoryPlanetStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class LifestoryPlanetStakingAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x882850E85EB765b28A725e818f04c2078191E4cB';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x00d1f83Ac925dD533aDF791D08f92C6ACA74BD91',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = LifestoryPlanetStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedPlanets(owner);
  }
}
