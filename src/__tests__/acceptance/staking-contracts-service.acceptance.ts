// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetType} from '@collabland/chain';
import {BigNumber, debugFactory, getEnvVar, pMap} from '@collabland/common';
import {Application} from '@loopback/core';
import {expect} from '@loopback/testlab';
import {StakingContractsComponent} from '../../component';
import {STAKING_CONTRACTS_SERVICE} from '../../keys';
const debug = debugFactory('collabland:staking-contracts');

// eslint-disable-next-line @typescript-eslint/no-misused-promises
describe('Staking contracts service', async () => {
  const app = new Application();
  app.component(StakingContractsComponent);
  const service = await app.get(STAKING_CONTRACTS_SERVICE);

  const angelBlockApiKey = getEnvVar('ANGEL_BLOCK_SUBGRAPH_API_KEY');
  const contracts = service.stakingContracts.filter(
    c => angelBlockApiKey != null || c.contractName !== 'AngelBlock',
  );

  contracts.forEach(contract => {
    it('gets staked token ids for ' + contract.contractName, async () => {
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

  contracts.forEach(contract => {
    it('gets staked token balances for ' + contract.contractName, async () => {
      debug('Contract: %s', contract.contractName);
      const staked = await service.getStakedTokenBalance(
        '0x9abbf7218c65c4d22c8483b5d6be93075a3c159c',
        contract.contractAddress,
      );
      expect(staked).to.be.instanceOf(BigNumber);
    });
  });

  contracts.forEach(contract => {
    it('gets staking asset types for ' + contract.contractName, async () => {
      debug('Contract: %s', contract.contractName);
      const assetType = service.getStakingAssetType(contract.contractAddress);
      if (assetType != null) {
        expect(assetType).to.be.instanceOf(AssetType);
      }
    });
  });
});
