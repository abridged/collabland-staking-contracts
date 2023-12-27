// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {RdStaking__factory} from '../types/index.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RDStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xEED7870BBbb6aCE5C38b3CC8b23Eee2a6aCBC7aF';
  chainId = 137;
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xace8187b113a38f83bd9c896c6878b175c234dcc',
    },
  ];

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = RdStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getTokenIdsForAddress(owner);
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = RdStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.balanceOf(owner);
  }
}
