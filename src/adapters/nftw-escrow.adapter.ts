// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetName} from '@collabland/chain';
import {pMap} from '@collabland/common';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, providers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';
import {MtgStaking__factory} from '../types/factories/MtgStaking__factory';
import {NftwEscrow__factory} from '../types/factories/NftwEscrow__factory';
import {NftwEscrow} from '../types/NftwEscrow';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class NFTWEscrowStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x69f0b8c5e94f6b64d832b7d9b15f3a88cb2f6f4b';

  async getStakedTokenIds(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber[]> {
    const contract = NftwEscrow__factory.connect(
      this.contractAddress,
      provider,
    );
    const tokenIdsByOwner: Record<string, BigNumber[]> =
      await this.getTokenIdsByOwner(contract);
    return tokenIdsByOwner[owner];
  }

  private async getTokenIdsByOwner(contract: NftwEscrow) {
    const tokenIdsByOwner: Record<string, BigNumber[]> = {};
    const tokenIds = new Array<number>(10001);
    for (let i = 1; i <= 10000; i++) {
      tokenIds[i - 1] = i;
    }
    await pMap(tokenIds, async i => {
      const tokenId = BigNumber.from(i);
      const info = await contract.getWorldInfo(tokenId);
      tokenIdsByOwner[info.owner] = tokenIdsByOwner[info.owner] ?? [];
      tokenIdsByOwner[info.owner].push(tokenId);
    });
    return tokenIdsByOwner;
  }

  async getStakedTokenBalance(
    provider: providers.Provider,
    owner: string,
  ): Promise<BigNumber> {
    const contract = MtgStaking__factory.connect(
      this.contractAddress,
      provider,
    );
    return contract.numOfTokenStaked(owner);
  }

  async getStakingAsset(provider: providers.Provider): Promise<AssetName> {
    /*
    const contract = NftwEscrow__factory.connect(
      this.contractAddress,
      provider,
    );
    */
    // NFTW_ERC721
    // const asset = await contract.name();
    return new AssetName({
      namespace: 'ERC721',
      reference: 'NFTW',
    });
  }
}
