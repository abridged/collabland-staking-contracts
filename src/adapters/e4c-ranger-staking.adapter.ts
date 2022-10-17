// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {E4cRangerStaking__factory} from '../types/factories/E4cRangerStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class E4CRangerStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x9c18beA91AE053397918410311dbB89295baE18b';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xbA265B93519E6473F34F46ee35F4B23970F41a3f',
    },
  ];

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = E4cRangerStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );

    const z = [];

    for (let i = 0; i < 1024; ++i) {
      const target = await contract.originalOwner(i);
      if (target === owner) z.push(BigNumber.from(i));
    }
    return z;
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const Ids = await this.getStakedTokenIds(owner);
    return BigNumber.from(Ids.length);
  }
}
