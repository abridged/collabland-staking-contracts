// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {UwulendStaking__factory} from '../types/factories/uwulendstaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class UwULendStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xe3643512532Fe1f3522745787e883F9729527186';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0x3E04863DBa602713Bb5d0edbf7DB7C3A9A2B6027',
    },
  ];

  getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = UwulendStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.balanceOf(owner);
  }
}
