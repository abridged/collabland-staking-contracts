// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application} from '@loopback/core';
import {getDefaultProvider} from 'ethers';
import {StakingContractsComponent} from '../component';
import {STAKING_CONTRACTS_SERVICE} from '../keys';

async function main() {
  const app = new Application();
  app.component(StakingContractsComponent);
  const service = await app.get(STAKING_CONTRACTS_SERVICE);
  const provider = getDefaultProvider(1);
  for (const address of service.getStakingContractAddresses()) {
    const staked = await service.getStakedTokenIds(
      provider,
      '0x9abbf7218c65c4d22c8483b5d6be93075a3c159c',
      address,
    );
    console.log('Staked tokens on %s: %O', address, staked);
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
