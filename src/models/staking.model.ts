// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {model, property} from '@loopback/repository';

@model()
export class StakingAsset {
  /**
   * Optional name for the staking asset (required if multiple assets are supported)
   */
  @property({
    type: 'string',
    description:
      'Optional name for the staking asset (required if multiple assets are supported)',
  })
  name?: string;
  /**
   * CAIP asset name, such as `ERC721:<0x...>`
   */
  @property({description: 'CAIP asset name, such as "ERC721:<0x...>"'})
  asset: string;
}

/**
 * Staking contract information
 */
@model()
export class StakingContractMetadata {
  /**
   * Staking contract address
   */
  @property()
  contractAddress: string;
  /**
   * Chain id
   */
  @property()
  chainId: number;
  /**
   * Assets that can be staked to this contract
   */
  @property.array(StakingAsset)
  supportedAssets: StakingAsset[];
}
