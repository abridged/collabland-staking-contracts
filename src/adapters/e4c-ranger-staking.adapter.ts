// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {Contract, Provider} from 'ethcall';
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
    const ecProvider = new Provider();
    ecProvider.init(this.provider);

    const contract = new Contract(this.contractAddress, E4cRangerStaking__factory.abi);

    const items = new Array(650);
    for (let i = 0; i < 650; i++) {
      items[i] = i + 1;
    }
    const owners = await ecProvider.all(items.map(i => contract.originalOwner(i)));

    const tokens: BigNumber[] = []
    for (let i = 0; i < owners.length; i++) {
      if (owners[i] === owner) tokens.push(BigNumber.from(i + 1));
    }
    return tokens;
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const Ids = await this.getStakedTokenIds(owner);
    return BigNumber.from(Ids.length);
  }
}
