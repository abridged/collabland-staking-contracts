// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
import {RoboStaking__factory} from '../types/factories/RoboStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RoboStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x5dACC3a466fD9E39DCCB2fabE0852285a76a2c59';

  async getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber[]> {
    const contract = RoboStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    return contract.getStaked(owner);
  }

  async getStakedTokenBalance(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber> {
    const contract = RoboStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    return contract.getStakedCount(owner);
  }

  async getStakingAsset(provider: providers.Provider): Promise<AssetName> {
    const contract = RoboStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    const asset = await contract.stakingToken();
    return new AssetName({
      namespace: 'ERC721',
      reference: asset,
    });
  }
}
