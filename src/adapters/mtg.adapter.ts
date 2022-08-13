// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Provider} from '@ethersproject/abstract-provider';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
import {MtgStaking__factory} from '../types/factories/MtgStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class MtgStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x2eb255a465c828837d6e8ba73072ec2c965dcf13';

  async getStakedTokenIds(
    provider: Provider,
    owner: string,
  ): Promise<BigNumber[]> {
    const contract = MtgStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    const records = await contract.getStakingRecords(owner);
    return records[0];
  }
}
