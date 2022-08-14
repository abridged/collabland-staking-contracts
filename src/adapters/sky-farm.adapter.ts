// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {SkyFarm__factory} from '../types/factories/SkyFarm__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SkyFarmContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xc5933172228E273CF829672921290ca107611757';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x573cA38Eb1353a0e8507bE82eC6111F0AF1F1E02',
    },
  ];

  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = SkyFarm__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedIds(owner);
  }
}
