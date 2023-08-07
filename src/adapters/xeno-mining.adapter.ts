// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import type {XenoStaking} from '../types/XenoStaking';
import {XenoStaking__factory} from '../types/factories/XenoStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class XenoStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x8621359B9F5D03F694E709a9F31305BEece31d44';
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x79e77FEF841C2ACdF506980144D07157B20EFfD1',
    },
  ];

  private contract: XenoStaking;

  constructor() {
    super();
    this.contract = XenoStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const data = await this.contract.stakedByOwner(owner);
    return data.map(id => BigNumber.from(id));
  }
}
