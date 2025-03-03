import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import type {CambriaCoresStaking} from '../types/CambriaCoresStaking.js';
import {CambriaCoresStaking__factory} from '../types/factories/CambriaCoresStaking__factory.js';

/**
 * Adapter for Core NFT staking contract
 */
@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class CambriaCoresStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address on Ronin
   */
  contractAddress = '0x85405d9078876e5f9f580a48f5774bea2c0047a6';

  /**
   * Assets that can be staked to this contract
   * Note: This is a single NFT contract with different tiers
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x17f93440990354a442369d56baeb20ab56e73ab1',
    },
  ];

  private contract: CambriaCoresStaking;

  constructor() {
    super();
    this.contract = CambriaCoresStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns Array of staked token IDs
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    return this.contract.getStakedCoreIds(owner);
  }

  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns Number of staked tokens
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(owner);
    return BigNumber.from(ids.length);
  }
}
