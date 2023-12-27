// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {RoboStaking__factory} from '../types/factories/RoboStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RoboStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x5dACC3a466fD9E39DCCB2fabE0852285a76a2c59';
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x01f61f3c7f27893b30E8abDAFD4a84cA8bD24B96',
    },
  ];

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = RoboStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStaked(owner);
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = RoboStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedCount(owner);
  }
}
