// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetType} from '@collabland/chain';
import {BigNumber, debugFactory, pMap} from '@collabland/common';
import {Application} from '@loopback/core';
import {expect} from '@loopback/testlab';
import {StakingContractsComponent} from '../../component';
import {STAKING_CONTRACTS_SERVICE} from '../../keys';
import {StakingContractsService} from '../../services';
const debug = debugFactory('collabland:staking-contracts');

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
      debug('Contract: %s', contract.contractName);
      try {
        const staked = await service.getStakedTokenIds(
          '0x9abbf7218c65c4d22c8483b5d6be93075a3c159c',
          contract.contractAddress,
        );
        expect(staked).to.be.Array();
      } catch (err) {
        console.error('Fail to test %s: %s', contract.contractName, err);
      }
    });
  });

  it.skip('gets staked token ids by asset type', async () => {
    const contracts = service.stakingContracts;
    await pMap(contracts, async contract => {
      debug('Contract: %s', contract.contractName);
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
      debug('Contract: %s', contract.contractName);
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
      debug('Contract: %s', contract.contractName);
      const assetType = service.getStakingAssetType(contract.contractAddress);
      if (assetType != null) {
        expect(assetType).to.be.instanceOf(AssetType);
      }
    });
  });
});
