// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
import {SkyFarm__factory} from '../types/factories/SkyFarm__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SkyFarmContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xc5933172228E273CF829672921290ca107611757';

  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber[]> {
    const contract = SkyFarm__factory.connect(this.contractAddress, provider);
    return contract.getStakedIds(owner);
  }

  async getStakingAsset(provider: providers.Provider): Promise<AssetName> {
    return new AssetName('ERC721:0x573cA38Eb1353a0e8507bE82eC6111F0AF1F1E02');
    /*
    const contract = SkyFarm__factory.connect(this.contractAddress, provider);
    const asset = await contract.skyverseContract();
    return new AssetName({
      namespace: 'ERC721',
      reference: asset,
    });
    */
  }
}
