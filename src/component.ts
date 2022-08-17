// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Component,
  ContextTags,
  injectable,
  ServiceOrProviderClass,
} from '@loopback/core';
import {CocoStakingContractAdapter} from './adapters/coco.adapter';
import {MtgStakingContractAdapter} from './adapters/mtg.adapter';
import {RirsuStakingContractAdapter} from './adapters/rirsu.adapter';
import {RoboStakingContractAdapter} from './adapters/robo.adapter';
import {SkyFarmContractAdapter} from './adapters/sky-farm.adapter';
import {StakingContractsController} from './controllers/staking-contracts.controller';
import {STAKING_CONTRACTS_COMPONENT} from './keys';
import {StakingContractsService} from './services/staking-contracts.service';

// Configure the binding for StakingContractsComponent
@injectable({
  tags: {[ContextTags.KEY]: STAKING_CONTRACTS_COMPONENT},
})
export class StakingContractsComponent implements Component {
  services: ServiceOrProviderClass<unknown>[] = [
    StakingContractsService,
    CocoStakingContractAdapter,
    MtgStakingContractAdapter,
    RirsuStakingContractAdapter,
    RoboStakingContractAdapter,
    SkyFarmContractAdapter,
    // NFTWEscrowStakingContractAdapter,
    StakingContractsController,
  ];
  constructor() {}
}
