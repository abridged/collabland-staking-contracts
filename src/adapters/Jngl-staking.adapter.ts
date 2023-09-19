// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {JnglStaking__factory} from '../types/factories/JnglStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class JnglStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x579D27a47A270601b041F8B36e7F5CBC37508B40';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0x4C45bbEc2fF7810ef4a77ad7BD4757C446Fe4155',
    },
  ];

  getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = JnglStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStaked(owner, 0);
  }
}
