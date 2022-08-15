// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey, CoreBindings} from '@loopback/core';
import type {StakingContractsComponent} from './component';
import type {StakingContractsService} from './services/staking-contracts.service';
import type {EthersProviderService} from './staking';

export const STAKING_CONTRACTS_COMPONENT =
  BindingKey.create<StakingContractsComponent>(
    `${CoreBindings.COMPONENTS}.StakingContractsComponent`,
  );

export const STAKING_CONTRACTS_SERVICE =
  BindingKey.create<StakingContractsService>(
    'services.StakingContractsService',
  );

export const ETHERS_PROVIDER_SERVICE = BindingKey.create<EthersProviderService>(
  'services.EthersProviderService',
);

export const STAKING_ADAPTERS_EXTENSION_POINT = 'collabland.stakingContracts';
