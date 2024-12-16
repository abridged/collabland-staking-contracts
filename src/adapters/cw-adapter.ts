import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {CwStakingBonus__factory} from '../types/factories/CwStakingBonus__factory.js';
import {CwStakingDiscount__factory} from '../types/factories/CwStakingDiscount__factory.js';
import {CwStakingWLTH__factory} from '../types/factories/CwStakingWLTH__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class CWStakingContractAdapter extends BaseStakingContractAdapter {
  chainId: 8453;
  contractAddressBonus = '0xD7E31990883250E53314b15EE555345f04D011E8';
  contractAddressDiscount = '0x5E71a0c7022D02639dFfAA386a0044c51b3B339b';
  contractAddressWLTH = '0xF4AA59f5192856F41Ae19CaAb4929CCD3a265e70';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0x99b2B1A2aDB02B38222ADcD057783D7e5D1FCC7D',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = CwStakingBonus__factory.connect(
      this.contractAddressBonus,
      this.provider,
    );
    const contract2 = CwStakingDiscount__factory.connect(
      this.contractAddressDiscount,
      this.provider,
    );
    const contract3 = CwStakingWLTH__factory.connect(
      this.contractAddressWLTH,
      this.provider,
    );

    // Fetch data from contracts concurrently and return a Promise
    return Promise.all([
      contract.calculateRewardInfo(owner),
      contract2.getStakedTokens(owner),
      contract3.stakingInfo(owner),
    ]).then(([rewardInfo, stakedTokens, stakingInfo]) => {
      // Extract specific elements from the resolved objects
      const stakedFromRewardInfo = BigNumber.from(rewardInfo.staked);
      const stakedFromContract2 = BigNumber.from(stakedTokens);
      const stakedFromStakingInfo = BigNumber.from(stakingInfo.totalStaked);

      // Return an array of BigNumbers
      return [stakedFromRewardInfo, stakedFromContract2, stakedFromStakingInfo];
    });
  }
}
