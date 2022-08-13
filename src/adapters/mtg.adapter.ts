// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
import {MtgStaking__factory} from '../types/factories/MtgStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class MtgStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x2eb255a465c828837d6e8ba73072ec2c965dcf13';

  async getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber[]> {
    const contract = MtgStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    const records = await contract.getStakingRecords(owner);
    return records[0];
  }

  async getStakingAsset(provider: providers.Provider): Promise<AssetName> {
    const contract = MtgStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    const asset = await contract.MTGAddress();
    return new AssetName({
      namespace: 'ERC721',
      reference: asset,
    });
  }
}
