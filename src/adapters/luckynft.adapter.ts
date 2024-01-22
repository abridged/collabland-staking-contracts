// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import type {Luckynft} from '../types/Luckynft.js';
// Use the full path to import instead of `../types`
import {Luckynft__factory} from '../types/factories/Luckynft__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class LuckyNFTStakingContractAdapter extends BaseStakingContractAdapter {
  private contract: Luckynft;
  /**
   * The contract address
   */
  contractAddress = '0x582cd31590bfc3be6f3b27f81897033e0419ef37';

  /**
   * The chain the assets exist on
   */
  chainId: number = 137;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x99FA8D8d73db614c84a88AB4483C1854aF5D12d5',
    },
  ];

  constructor() {
    super();
    this.contract = Luckynft__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const data = await this.contract.getStakingData(owner);
    return data.map(d => d.tokenId);
  }
}
