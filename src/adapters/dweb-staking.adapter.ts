import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {DwebStaking__factory} from '../types/factories/DwebStaking__factory.js';

abstract class BaseDwebStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = DwebStaking__factory.connect(
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
export class DwebEthereumStakingContractAdapter extends BaseDwebStakingContractAdapter {
  contractAddress = '0x7aA1f1A3c2BBfB7802313b6f18a2fc408A030564';
  chainId = 1;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0xE7f58A92476056627f9FdB92286778aBd83b285F',
    },
    {
      asset: 'ERC20:0xf4Eae3218778510CC1D07Ed22338d6D8df2AdaF1',
    },
  ];
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class DwebPolygonStakingContractAdapter extends BaseDwebStakingContractAdapter {
  contractAddress = '0x5DB2dE06eD6797E180cD432Ff0BeC6332a34C18E';
  chainId = 137;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0x8839e639F210B80ffea73AedF51baed8DAc04499',
    },
    {
      asset: 'ERC20:0xfca921d46ab12b54eb22aabff798a4c861419ae0',
    },
  ];
}
