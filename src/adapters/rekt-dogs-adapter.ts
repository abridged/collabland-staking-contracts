// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {RektDogsStaking__factory} from '../types/factories/RektDogsStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RektDogsStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x52503e5aeD11299288C402422bf032D00E3141e0';
  chainId: 137;
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xace8187b113a38f83bd9c896c6878b175c234dcc',
    },
  ];

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = RektDogsStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedTokenIds(owner);
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = RektDogsStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.balanceOf(owner);
  }
}
