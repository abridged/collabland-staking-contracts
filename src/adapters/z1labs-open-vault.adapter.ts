// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {Z1labsOpenVault__factory} from '../types/factories/Z1labsOpenVault__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class Z1labsOpenVaultContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x68605AA964F25aC8c7C159331F9dF050321FDcc6';
  supportedAssets: StakingAsset[] = [
    {
      name: 'DEAI',
      asset: 'ERC20:0x1495bc9e44Af1F8BCB62278D2bEC4540cF0C05ea',
    },
  ];

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = Z1labsOpenVault__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const balance = await contract.getDepositedAmount(owner);
    return balance;
  }
}
