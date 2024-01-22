import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {HabibizStaking} from '../types/HabibizStaking.js';
import {HabibizStaking__factory} from '../types/factories/HabibizStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class HabibizRoyalsStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x5Fe8C486B5f216B9AD83C12958d8A03eb3fD5060';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'habibiz',
      asset: 'ERC721:0x98a0227e99e7af0f1f0d51746211a245c3b859c2',
    },
    {
      name: 'royals',
      asset: 'ERC721:0x49f0c2d84f2db48f5b610d115e43ea6c983507ff ',
    },
  ];

  private contract: HabibizStaking;

  constructor() {
    super();
    this.contract = HabibizStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]> {
    if (assetName === 'habibiz') {
      return this.contract.habibizOfStaker(owner);
    } else if (assetName === 'royals') {
      return this.contract.royalsOfStaker(owner);
    } else {
      return [];
    }
  }

  /**
   * Gets number/balance of staked assets ( habibiz/royals )
   * @param owner The owner address
   * @param assetName The asset name ( habibiz/royals)
   * @returns
   */
  async getStakedTokenBalance(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber> {
    const number = (await this.getStakedTokenIds(owner, assetName)).length;

    return Promise.resolve(BigNumber.from(number));
  }
}
