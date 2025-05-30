// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {Z1labs9mStaking__factory} from '../types/factories/Z1labs9mStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class Z1labs9mStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x8DBA1f564458dd46283ca3a4CDf6CA019963aB42';
  supportedAssets: StakingAsset[] = [
    {
      name: 'DEAI',
      asset: 'ERC20:0x1495bc9e44Af1F8BCB62278D2bEC4540cF0C05ea',
    },
  ];

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = Z1labs9mStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const balance = await contract.getUserBalance(owner);
    return balance;
  }
}
