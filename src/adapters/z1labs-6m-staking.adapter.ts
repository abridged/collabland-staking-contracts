// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {Z1labs6mStaking__factory} from '../types/factories/Z1labs6mStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class Z1labs6mStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x88062FE2751f3D5cEC18F6113A532A611632ae79';
  supportedAssets: StakingAsset[] = [
    {
      name: 'DEAI',
      asset: 'ERC20:0x1495bc9e44Af1F8BCB62278D2bEC4540cF0C05ea',
    },
  ];

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = Z1labs6mStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const balance = await contract.getUserBalance(owner);
    return balance;
  }
}
