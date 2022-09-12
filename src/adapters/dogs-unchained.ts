// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {DuStaking} from '../types/DuStaking';
import {DuStaking__factory} from '../types/factories/DuStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class DogsUnchainedStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xd742193c84062c1e0488545fb91a32d220ec6c76';
  infoAddress = '0x5e2e43585df73a420b5866159f3de2a144c4d51e';

  supportedAssets: StakingAsset[] = [
    {
      name: 'Dogs Unchained',
      asset: 'ERC721:0x9c0ffc9088abeb2ea220d642218874639229fa7a',
    },
    {
      name: 'Proof of Steak',
      asset: 'ERC721:0xcab65c60d9dc47e1d450c7e9074f73f1ff75f181',
    },
    {
      name: 'Puppies Unchained',
      asset: 'ERC721:0x948bc723d7e33575427270ac4f26c73b8ba938aa',
    },
  ];

  supplies: Record<string, number> = {
    'Dogs Unchained': 9999,
    'Proof of Steak': 1405,
    'Puppies Unchained': 9999,
  };

  private async getOwnedAssets(
    contract: DuStaking,
    asset: StakingAsset,
    owner: string,
    maxId: number,
  ) {
    const token = new AssetName(asset.asset).reference;
    return (await contract.getStakedTokens(token, 1, maxId, owner)).filter(x =>
      x.gt(0),
    );
  }

  async getStakedTokenIds(
    owner: string,
    assetType = 'Dogs Unchained',
  ): Promise<BigNumber[]> {
    const contract = DuStaking__factory.connect(
      this.infoAddress,
      this.provider,
    );
    let assetIndex = 0; // default to dogs unchained
    let maxId = 10000;
    if (assetType.toLowerCase() === 'proof of steak') {
      assetIndex = 1;
      maxId = 1405;
    } else if (assetType.toLowerCase() === 'puppies unchained') {
      assetIndex = 2;
      maxId = 10000;
    }
    const assets = await this.getOwnedAssets(
      contract,
      this.supportedAssets[assetIndex],
      owner,
      maxId,
    );
    return assets;
  }
}
