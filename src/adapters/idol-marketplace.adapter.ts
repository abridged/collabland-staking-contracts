// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {IdolMarketplace__factory} from '../types/factories/IdolMarketplace__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class IdolMarketplaceContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x0dd5a35fe4cd65fe7928c7b923902b43d6ea29e7';
  supportedAssets: StakingAsset[] = [
    {
      name: 'Virtue',
      asset: 'ERC20:0x9416ba76e88d873050a06e5956a3ebf10386b863',
    },
  ];

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = IdolMarketplace__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const balance = await contract.getUserVirtueStake(owner);
    return balance;
  }
}
