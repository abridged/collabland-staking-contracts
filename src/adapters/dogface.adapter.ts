// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import type {DogfaceStaking} from '../types/DogfaceStaking.js';
import {DogfaceStaking__factory} from '../types/factories/DogfaceStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class DogfaceStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x8297c2E7f6485d765d603d3B3F4eb245A156bdB6';
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xBFcB983a6C3E392CbDdECa228854c51fBc29220a',
    },
  ];

  private contract: DogfaceStaking;

  constructor() {
    super();
    this.contract = DogfaceStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const data = await this.contract.getStakeData(owner);
    return data.stakedCounts;
  }

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const data = await this.contract.getStakeData(owner);
    return data.stakedTokenIds;
  }
}
