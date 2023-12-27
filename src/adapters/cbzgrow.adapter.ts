// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import type {Cbzgrow} from '../types/Cbzgrow.js';
// Use the full path to import instead of `../types`
import {Cbzgrow__factory} from '../types/factories/Cbzgrow__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class CbzGrowStakingContractAdapter extends BaseStakingContractAdapter {
  private contract: Cbzgrow;
  /**
   * The contract address
   */
  contractAddress = '0xd1A53bFbFF6E36b1E1436b2029582e6Bc86E2816';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'CornerBoyz',
      asset: 'ERC721:0x85be9dE7A369850A964616A2C04d79000d168DEA',
    },
    {
      name: 'CBZ Seeds',
      asset: 'ERC721:0x14fC5036bE2388e2c2aB8A80c86755ef1FCF6E00',
    },
  ];

  constructor() {
    super();
    this.contract = Cbzgrow__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string, name?: string): Promise<BigNumber[]> {
    if (name === 'CoenerBoyz') {
      return this.contract.stakedCBZs(owner);
    } else if (name === 'CBZ Seeds') {
      return this.contract.stakedSeeds(owner);
    } else {
      return [];
    }
  }

  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber> {
    const resp = await this.contract.stakers(owner);
    if (assetName === 'CoenerBoyz') {
      return resp.cbzStaked;
    } else if (assetName === 'CBZ Seeds') {
      return resp.seedStaked;
    } else {
      return BigNumber.from(0);
    }
  }
}
