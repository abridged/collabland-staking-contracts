// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {ReplicantxStaking__factory} from '../types/factories/ReplicantxStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class ReplicantXStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xcbb86983b29f64bf9c60cd26577b634efe0754ff';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'replicantX',
      asset: 'ERC721:0xea930142c75104f998dbccffefcf2f7eefcf1616',
    },
    {
      name: 'whiteRabbitKey',
      asset: 'ERC721:0x9c2cb82f40bab7165740e4fbc25017435f383fc5',
    },
  ];

  getStakedTokenBalance(owner: string, assetName?: string): Promise<BigNumber> {
    const contract = ReplicantxStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    if (assetName === 'replicantX') {
      return contract.numStakedTokens(
        owner,
        '0xea930142c75104f998dbccffefcf2f7eefcf1616',
      );
    } else if (assetName === 'whiteRabbitKey') {
      return contract.numStakedTokens(
        owner,
        '0x9c2cb82f40bab7165740e4fbc25017435f383fc5',
      );
    } else {
      return Promise.resolve(BigNumber.from(0));
    }
  }
}
