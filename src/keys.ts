// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey, CoreBindings} from '@loopback/core';
import {StakingContractsComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace StakingContractsComponentBindings {
  export const COMPONENT = BindingKey.create<StakingContractsComponent>(
    `${CoreBindings.COMPONENTS}.StakingContractsComponent`,
  );
}
