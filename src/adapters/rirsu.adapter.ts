// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
import {RirsuStaking__factory} from '../types/factories/RirsuStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RirsuStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x2fBe96A414add128DB33C90a81Ed781f4dF14885';

  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
    assetType = 'riri',
  ): Promise<BigNumber[]> {
    const contract = RirsuStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    if (assetType === 'sanctum') {
      return contract.stakedSanctums(owner);
    }
    return contract.stakedRiris(owner);
  }

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
  async getStakingAsset(provider: providers.Provider): Promise<AssetName> {
    return new AssetName({
      namespace: 'ERC721',
      // FIXME(rfeng): There is no view method to get the staking asset
      reference: 'riri',
    });
  }
}
