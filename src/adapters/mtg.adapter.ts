// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {MtgStaking__factory} from '../types/factories/MtgStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class MtgStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x2eb255a465c828837d6e8ba73072ec2c965dcf13';

  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x49907029e80dE1cBB3A46fD44247BF8BA8B5f12F',
    },
  ];

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = MtgStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const records = await contract.getStakingRecords(owner);
    return records[0];
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = MtgStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.numOfTokenStaked(owner);
  }
}
