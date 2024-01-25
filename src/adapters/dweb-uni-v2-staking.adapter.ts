import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {DwebUniV2Staking__factory} from '../types/factories/DwebUniV2Staking__factory.js';

abstract class BaseDwebUniV2StakingContractAdapter extends BaseStakingContractAdapter {
  supportedAssets: StakingAsset[] = [];

  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = DwebUniV2Staking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    try {
      return (await contract.getStakeDetails(owner)).initialDeposit;
    } catch (err) {
      return BigNumber.from(0);
    }
  }
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class DwebUniV2EthereumStakingContractAdapter extends BaseDwebUniV2StakingContractAdapter {
  contractAddress = '0x594E33aC3B56E9c0109deeBe03EEA2e39fE1A852';
  chainId = 1;
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class DwebUniV2PolygonStakingContractAdapter extends BaseDwebUniV2StakingContractAdapter {
  contractAddress = '0x5DB2dE06eD6797E180cD432Ff0BeC6332a34C18E';
  chainId = 137;
}
