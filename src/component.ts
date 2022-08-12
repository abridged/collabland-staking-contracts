// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
} from '@loopback/core';
import {StakingContractsComponentBindings} from './keys';
import {
  DEFAULT_COLLABLAND_STAKING_OPTIONS,
  StakingContractsComponentOptions,
} from './types';

// Configure the binding for StakingContractsComponent
@injectable({
  tags: {[ContextTags.KEY]: StakingContractsComponentBindings.COMPONENT},
})
export class StakingContractsComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: StakingContractsComponentOptions = DEFAULT_COLLABLAND_STAKING_OPTIONS,
  ) {}
}
