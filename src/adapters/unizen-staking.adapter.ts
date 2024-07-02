import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {UnizenStaking__factory} from '../types/factories/UnizenStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)

export class UnizenStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x5655B12f1e74D1D1fc3F1048a89850a0149Aa5d4';

  PZCX_ADDRESS = '0xdd75542611d57c4b6e68168b14c3591c539022ed'
  /**
   * The chain the assets exist on
   */
  chainId: number = 137;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'pZCX',
      asset: `ERC20:${this.PZCX_ADDRESS}`,
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = UnizenStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    try {
      const userStakes = await contract.callStatic['getUsersStakedAmountOfToken'](owner, this.PZCX_ADDRESS);
      return [userStakes]
    } catch (error) {
      return [BigNumber.from(0)]
    }
  }

  async getStakedTokenBalance(owner: string, assetName: string): Promise<BigNumber> {
    const contract = UnizenStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    try {
      const userStakes = await contract.callStatic['getUsersStakedAmountOfToken'](owner, this.PZCX_ADDRESS);
      return userStakes
    } catch (error) {
      return BigNumber.from(0)
    }
  }
}

