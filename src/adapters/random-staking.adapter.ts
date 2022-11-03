// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {RandomStaking__factory} from '../types/factories/RandomStaking__factory';
import type {RandomStaking} from '../types/RandomStaking';

/**
 * The nft contract address
 *
 */
const theRandomNftContractAddress =
  '0x79Aa05963c92A2a10d96bD840Eb5e73a1E675E92';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RandomStakingContractAdapter extends BaseStakingContractAdapter {
  private contract: RandomStaking;
  /**
   * The staking contract address
   */
  contractAddress = '0xB87ef86998cf8a0a75E5d0c323001a133a765537';
  supportedAssets: StakingAsset[] = [
    {
      name: 'TheRandoms',
      asset: `ERC721:${theRandomNftContractAddress}`,
    },
  ];

  constructor() {
    super();
    this.contract = RandomStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }
  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    return this.contract.tokensOfOwner(owner, theRandomNftContractAddress);
  }

  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenBalance(owner: string): Promise<BigNumber> {
    return this.contract.balanceOf(owner, theRandomNftContractAddress);
    // return balance;
  }

  async isAssetSupported(assetName: string): Promise<boolean> {
    const asset = new AssetName(assetName);
    return this.contract.stakeAllowedCollections(asset.reference);
  }
}
