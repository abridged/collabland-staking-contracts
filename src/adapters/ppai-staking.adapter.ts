// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {PpaiStaking__factory} from '../types/factories/PpaiStaking__factory.js';
import {PpaiToken__factory} from '../types/factories/PpaiToken__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class PpaiStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x8439dCEE8c9e356E3DD18c0d54c66E31F8914FC9';
  tokenAddress = '0x2972F737450EBb29434d4102CAF0880c0e768292';
  chainId: number = 8453;

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC20:0x2972F737450EBb29434d4102CAF0880c0e768292',
    },
  ];

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const stakingContract = PpaiStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const tokenContract = PpaiToken__factory.connect(
      this.tokenAddress,
      this.provider,
    );

    const stakingInfo = await stakingContract.userInfo(0, owner);
    const membershipAmount = await tokenContract.getMembership(owner);

    return stakingInfo.amount.add(membershipAmount);
  }
}
