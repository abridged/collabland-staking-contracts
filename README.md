# @collabland/staking-contracts

This project provides support for a curated list of stacking contracts for Collab.Land's token gating capabilities.

## Get started

1. Install dependencies

   ```sh
   npm install
   ```

2. Run the build

   ```sh
   npm run build
   ```

3. Run the example

   ```sh
   node dist/__examples__/main
   ```

## Format code and check style

```sh
npm run lint
```

or

```sh
npm run lint:fix
```

## Publish a new release

```sh
npm run release
```

## Add a new staking contract

To add a new staking contract, please follow the steps below.

1. Add the contract ABI json file, go to `src/contracts` and create a file such
   as `my-abi.json`

2. Run `npm run build` to generate TypeScript client code for the contract

3. Add an adapter class to `src/adapters`:

```ts
import {Provider} from '@ethersproject/abstract-provider';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {StackingContractAdapter} from '../staking';
// Use the full path to import instead of `../types`
import {Coco__factory} from '../types/factories/Coco__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class CocoStakingContractAdapter implements StackingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x0Df016Fb18ef4195b2CF9d8623E236272ec52e14';

  /**
   * Get staked token ids for the given owner
   * @param provider - Ethers provider
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(provider: Provider, owner: string): Promise<BigNumber[]> {
    const contract = Coco__factory.connect(this.contractAddress, provider);
    return contract.getStakes(owner);
  }
}
```

4. Register the adapter class to `src/component.ts`

```ts
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
  ];
  constructor() {}
}
```
