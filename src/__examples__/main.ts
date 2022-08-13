// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application} from '@loopback/core';
import {StakingContractsComponent} from '../component';
import {STAKING_CONTRACTS_SERVICE} from '../keys';

async function main() {
  const app = new Application();
  app.component(StakingContractsComponent);
  const service = await app.get(STAKING_CONTRACTS_SERVICE);
  for (const contract of service.getStakingContracts()) {
    const staked = await service.getStakedTokenIds(
      '0x9abbf7218c65c4d22c8483b5d6be93075a3c159c',
      contract.address,
    );
    console.log('Staked tokens on %s: %O', contract.address, staked);
  }
  await app.stop();
  process.exit(0);
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
