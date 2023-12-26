// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {IStakingModule__factory} from '../types/factories/IStakingModule__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class PerionCreditsStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xadb112c62b87da63645ecdba93046a2e13f585a1';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'PerionCredits',
      asset: 'ERC20:0x60bE1e1fE41c1370ADaF5d8e66f07Cf1C2Df2268',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = IStakingModule__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const balances = await contract.balances(owner);
    return balances[0];
  }

  async getStakedTokenIds(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]> {
    const balance = await this.getStakedTokenBalance(owner);
    return new Array<BigNumber>(balance).fill(BigNumber.from(0));
  }
}
