// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import type {Dogface2ndStaking} from '../types/Dogface2ndStaking';
import {Dogface2ndStaking__factory} from '../types/factories/Dogface2ndStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class Dogface2ndStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x13a4c456ADcb76548EEF25Be5aFBdEE018724938';
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x480de54f42b17d459314f9D76cAa1A531B43c240',
    },
  ];

  private contract: Dogface2ndStaking;

  constructor() {
    super();
    this.contract = Dogface2ndStaking__factory.connect(
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
