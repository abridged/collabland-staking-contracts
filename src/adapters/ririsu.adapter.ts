// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {RirisuStaking__factory} from '../types/factories/RirisuStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RirisuStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x2fBe96A414add128DB33C90a81Ed781f4dF14885';

  /*
    constructor(
        address ririAddress,
        address sanctumAddress,
        address aeonAddress
    ) {
        riri = IERC721(ririAddress);
        sanctum = ISanctum(sanctumAddress);
        aeon = IAeon(aeonAddress);
    }
  */
  supportedAssets: StakingAsset[] = [
    {
      name: 'Ririsu',
      asset: 'ERC721:0x8d6238920D9A54Bf048436d4119475A002D51FD6',
    },
    {
      name: 'Sanctum',
      asset: 'ERC721:0xF4908f72c83bfdC2E79a3D30e00aA7f128Da3953',
    },
  ];

  async getStakedTokenIds(
    owner: string,
    assetType = 'Ririsu',
  ): Promise<BigNumber[]> {
    const asset = this.getStakingAsset(assetType);
    if (asset == null) return [];

    const contract = RirisuStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    if (asset.name?.toLowerCase() === 'sanctum') {
      return contract.stakedSanctums(owner);
    }
    return contract.stakedRiris(owner);
  }
}
