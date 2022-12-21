// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetType} from '@collabland/chain';
import {BigNumber, pMap} from '@collabland/common';
import {Application} from '@loopback/core';
import {expect} from '@loopback/testlab';
import {StakingContractsComponent} from '../../component';
import {STAKING_CONTRACTS_SERVICE} from '../../keys';
import {StakingContractsService} from '../../services';

describe('Staking contracts service', () => {
  let app: Application;
  let service: StakingContractsService;

  before(async () => {
    app = new Application();
    app.component(StakingContractsComponent);
    service = await app.get(STAKING_CONTRACTS_SERVICE);
  });

  it('gets staked token ids', async () => {
    const contracts = service.stakingContracts;
    await pMap(contracts, async contract => {
      const staked = await service.getStakedTokenIds(
        '0x9abbf7218c65c4d22c8483b5d6be93075a3c159c',
        contract.contractAddress,
      );
      expect(staked).to.be.Array();
    });
  });

  it.skip('gets staked token ids by asset type', async () => {
    const contracts = service.stakingContracts;
    await pMap(contracts, async contract => {
      const staked = await service.getStakedTokenIdsByAssetType(
        '0x9abbf7218c65c4d22c8483b5d6be93075a3c159c',
        1,
        contract.supportedAssets[0].asset,
      );
      expect(staked).to.be.Array();
    });
  });

  it('gets staked token balances', async () => {
    const contracts = service.stakingContracts;
    await pMap(contracts, async contract => {
      const staked = await service.getStakedTokenBalance(
        '0x9abbf7218c65c4d22c8483b5d6be93075a3c159c',
        contract.contractAddress,
      );
      expect(staked).to.be.instanceOf(BigNumber);
    });
  });

  it('gets staking asset types', async () => {
    const contracts = service.stakingContracts;
    await pMap(contracts, async contract => {
      const assetType = service.getStakingAssetType(contract.contractAddress);
      if (assetType != null) {
        expect(assetType).to.be.instanceOf(AssetType);
      }
    });
  });
});
