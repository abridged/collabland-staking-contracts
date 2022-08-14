// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {RirsuStaking__factory} from '../types/factories/RirsuStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RirsuStakingContractAdapter extends BaseStakingContractAdapter {
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
      name: 'riri',
      asset: 'ERC721:riri',
    },
    {
      name: 'sanctum',
      asset: 'ERC721:sanctum',
    },
  ];

  getStakedTokenIds(owner: string, assetType = 'riri'): Promise<BigNumber[]> {
    const contract = RirsuStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    if (assetType === 'sanctum') {
      return contract.stakedSanctums(owner);
    }
    return contract.stakedRiris(owner);
  }
}
