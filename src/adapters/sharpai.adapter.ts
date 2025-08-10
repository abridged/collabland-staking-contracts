// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
import {SharpaiStaking__factory} from '../types/factories/SharpaiStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SharpAiStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x7900E2F5eC37dA2098881729Fda6784e31e02Aa8';
  supportedAssets: StakingAsset[] = [
    {
      name: 'SharpAI',
      asset: 'ERC20:0xAddB6dC7E2F7caEA67621DD3Ca2e8321ade33286',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string, assetName?: string): Promise<BigNumber[]> {
    const contract = SharpaiStaking__factory.connect(
      this.contractAddress,
      this.provider
    );
    const tier = assetName ? parseInt(
      assetName, 10) || 0 : 0;
    return [await contract.userBalances(owner, tier)];
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = SharpaiStaking__factory.connect(
      this.contractAddress,
      this.provider
    );
    return contract.totalStaked();
  }
}
