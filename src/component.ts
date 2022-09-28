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
import {DogsUnchainedStakingContractAdapter} from './adapters/dogs-unchained.adapter';
import {PerionCreditsStakingContractAdapter} from './adapters/erc20-staking.adapter';
import {MtgStakingContractAdapter} from './adapters/mtg.adapter';
import {RirisuStakingContractAdapter} from './adapters/ririsu.adapter';
import {RoboStakingContractAdapter} from './adapters/robo.adapter';
import {SkyFarmStakingContractAdapter} from './adapters/sky-farm.adapter';
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
    RirisuStakingContractAdapter,
    RoboStakingContractAdapter,
    SkyFarmStakingContractAdapter,
    DogsUnchainedStakingContractAdapter,
    // NFTWEscrowStakingContractAdapter,
    PerionCreditsStakingContractAdapter,
    // DigitzStakingContractAdapter,
  ];
  constructor() {}
}
