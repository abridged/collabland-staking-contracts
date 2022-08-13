// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
// Use the full path to import instead of `../types`
import {Coco__factory} from '../types/factories/Coco__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class CocoStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x0Df016Fb18ef4195b2CF9d8623E236272ec52e14';

  /**
   * Get staked token ids for the given owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber[]> {
    const contract = Coco__factory.connect(this.contractAddress, provider);
    return contract.getStakes(owner);
  }

  async getStakingAsset(provider: providers.Provider): Promise<AssetName> {
    const contract = Coco__factory.connect(this.contractAddress, provider);
    const asset = await contract.waveCatchers();
    return new AssetName({
      namespace: 'ERC721',
      reference: asset,
    });
  }
}
