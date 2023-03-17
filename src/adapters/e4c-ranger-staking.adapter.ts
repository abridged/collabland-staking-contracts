// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {JsonFragment} from '@ethersproject/abi';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {Contract, Provider} from 'ethcall';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {E4cRangerStaking__factory} from '../types/factories/E4cRangerStaking__factory';

abstract class E4CStakingContractAdapter extends BaseStakingContractAdapter {
  private ecProvider: Provider;
  private contract: Contract;

  private async init() {
    if (this.ecProvider == null) {
      this.contract = new Contract(
        this.contractAddress,
        E4cRangerStaking__factory.abi as unknown as JsonFragment[],
      );
      this.ecProvider = new Provider();
      await this.ecProvider.init(this.provider);
    }
  }

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    await this.init();
    const items = new Array(650);
    for (let i = 0; i < 650; i++) {
      items[i] = i + 1;
    }
    const owners = await this.ecProvider.all(
      items.map(i => this.contract.originalOwner(i)),
    );

    const tokens: BigNumber[] = [];
    for (let i = 0; i < owners.length; i++) {
      if (owners[i] === owner) tokens.push(BigNumber.from(i + 1));
    }
    return tokens;
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(owner);
    return BigNumber.from(ids.length);
  }
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class E4CGoldStakingContractAdapter extends E4CStakingContractAdapter {
  contractName = 'EC4Gold';
  contractAddress = '0x9c18beA91AE053397918410311dbB89295baE18b';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xbA265B93519E6473F34F46ee35F4B23970F41a3f',
    },
  ];
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class E4CRangerStakingContractAdapter extends E4CStakingContractAdapter {
  contractName = 'EC4Ranger';
  contractAddress = '0xadf4343f4e8eb6faf88c06a97ed6e0c229566e1d';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xC17Aa29c43e4cE0c349749C8986a03B2734813fa',
    },
  ];
}
