// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import type {RivalBearsStaking} from '../types/RivalBearsStaking';
// Use the full path to import instead of `../types`
import {RivalBearsStaking__factory} from '../types/factories/RivalBearsStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RivalBearsStakingContractAdapter extends BaseStakingContractAdapter {
  private contract: RivalBearsStaking;
  /**
   * The contract address
   */
  contractAddress = '0xd1A53bFbFF6E36b1E1436b2029582e6Bc86E2816';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'Mad Honey',
      asset: 'ERC721:0x86c18085b8949ff3dc53ec5c3a3a143ccfbc960a',
    },
    {
      name: 'Rival Bears',
      asset: 'ERC721:0xa25541164ae9d59322b59fe94a73869b494c3691',
    },
  ];

  constructor() {
    super();
    this.contract = RivalBearsStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string, name?: string): Promise<BigNumber[]> {
    const stakes = await this.contract.getStakes(owner);
    //const tokenIds = new Array<BigNumber>;  //deprecated Array constructor for npm test
    const tokenIds: PromiseLike<BigNumber[]> | BigNumber[] = [];
    let nftAddress;
    if (name === 'Rival Bears') {
      nftAddress = "0xa25541164ae9d59322b59fe94a73869b494c3691";
    }
    else if (name === 'Mad Honey') {
      nftAddress = "0x86c18085b8949ff3dc53ec5c3a3a143ccfbc960a";
    }
    else {
      return tokenIds;
    }
    for (const stake of stakes) {
      if (stake.nft.toLowerCase() === nftAddress.toLowerCase()) {
        tokenIds.push(stake.tokenId);
      }
    }
    return tokenIds;
  }

  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber> {
    const stakes = await this.contract.getStakes(owner);
    let count = 0;
    let nftAddress;
    if (assetName === 'Rival Bears') {
      nftAddress = "0xa25541164ae9d59322b59fe94a73869b494c3691";
    }
    else if (assetName === 'Mad Honey') {
      nftAddress = "0x86c18085b8949ff3dc53ec5c3a3a143ccfbc960a";
    }
    else {
      return BigNumber.from(0);
    }
    for (const stake of stakes) {
      if (stake.nft.toLowerCase() === nftAddress.toLowerCase()) {
        count++;
      }
    }
    return BigNumber.from(count);
  }
}
