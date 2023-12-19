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
import {ChillRxStakingContractAdapter} from './adapters/chillrx.adapter';
import {CocoStakingContractAdapter} from './adapters/coco.adapter';
import {DogfaceStakingContractAdapter} from './adapters/dogface.adapter';
import {Dogface2ndStakingContractAdapter} from './adapters/dogface2.adapter';
import {DogsUnchainedStakingContractAdapter} from './adapters/dogs-unchained.adapter';
import {
  E4CGoldStakingContractAdapter,
  E4CRangerStakingContractAdapter,
} from './adapters/e4c-ranger-staking.adapter';
import {PerionCreditsStakingContractAdapter} from './adapters/erc20-staking.adapter';
import {IdolMarketplaceContractAdapter} from './adapters/idol-marketplace.adapter';
import {LifestoryPlanetStakingAdapter} from './adapters/lifestory-planet-staking.adapter';
import {MeltdownContractAdapter} from './adapters/meltdown-1.adapter';
import {Meltdown03ContractAdapter} from './adapters/meltdown.adapter';

import {AngelBlockStakingContractAdapter} from './adapters/ab.adapter';
import {BansheesStakingContractAdapter} from './adapters/banshees-staking.adapter';
import {BapeliensStakingContractAdapter} from './adapters/bapeliens-staking.adapter';
import {CbzGrowStakingContractAdapter} from './adapters/cbzgrow.adapter';
import {
  DwebEthereumStakingContractAdapter,
  DwebPolygonStakingContractAdapter,
} from './adapters/dweb-staking.adapter';
import {FlooringProtocolStakingContractAdapter} from './adapters/flooring-protocol-staking.adapter';
import {GenKStakingContractAdapter} from './adapters/genk-staking.adapter';
import {HabibizRoyalsStakingContractAdapter} from './adapters/habibiz-royals.adapter';
import {JnglStakingContractAdapter} from './adapters/Jngl-staking.adapter';
import {MoonrunnersStakingContractAdapter} from './adapters/moonrunners.adapter';
import {MtgStakingContractAdapter} from './adapters/mtg.adapter';
import {OmniguardEternalsStakingContractAdapter} from './adapters/omniguard-eternals.adapter';
import {PlutoallianceStakingAdapter} from './adapters/plutoalliance.adapter';
import {PrimordiaStakingContractAdapter} from './adapters/primordia.adapter';
import {RandomStakingContractAdapter} from './adapters/random-staking.adapter';
import {RDStakingContractAdapter} from './adapters/rd-staking.adapter';
import {RektDogsStakingContractAdapter} from './adapters/rekt-dogs-adapter';
import {
  ReNFTEthereumSylvesterV0StakingContractAdapter,
  ReNFTPolygonSylvesterV1StakingContractAdapter,
} from './adapters/renft.adapter';
import {ReplicantXStakingContractAdapter} from './adapters/replicantx-staking.adapter';
import {RirisuStakingContractAdapter} from './adapters/ririsu.adapter';
import {RivalBearsStakingContractAdapter} from './adapters/rival-bears-staking.adapter';
import {RoboStakingContractAdapter} from './adapters/robo.adapter';
import {SkyFarmStakingContractAdapter} from './adapters/sky-farm.adapter';
import {SpitYardContractAdapter} from './adapters/spit-yard.adapter';
import {SugartownStakingContractAdapter} from './adapters/sugartown.adapter';
import {SupremeKong2StakingContractAdapter} from './adapters/supreme-kong-2-staking.adapter';
import {SupremeKongStakingContractAdapter} from './adapters/supreme-kong-staking.adapter';
import {TtooStakingContractAdapter} from './adapters/ttoo-staking.adapter';
import {UwULendStakingContractAdapter} from './adapters/uwulend-staking.adapter';
import {WarriorsofankhStakingContractAdapter} from './adapters/warriorsofankh-staking.adapter';
import {XenoStakingContractAdapter} from './adapters/xeno-mining.adapter';
import {STAKING_CONTRACTS_COMPONENT} from './keys';
import {StakingContractsService} from './services/staking-contracts.service';

// Configure the binding for StakingContractsComponent
@injectable({
  tags: {[ContextTags.KEY]: STAKING_CONTRACTS_COMPONENT},
})
export class StakingContractsComponent implements Component {
  services: ServiceOrProviderClass<unknown>[] = [
    RivalBearsStakingContractAdapter,
    RDStakingContractAdapter,
    Meltdown03ContractAdapter,
    RektDogsStakingContractAdapter,
    SpitYardContractAdapter,
    RandomStakingContractAdapter,
    E4CRangerStakingContractAdapter,
    E4CGoldStakingContractAdapter,
    StakingContractsService,
    LifestoryPlanetStakingAdapter,
    IdolMarketplaceContractAdapter,
    ChillRxStakingContractAdapter,
    CocoStakingContractAdapter,
    MtgStakingContractAdapter,
    RirisuStakingContractAdapter,
    RoboStakingContractAdapter,
    SkyFarmStakingContractAdapter,
    UwULendStakingContractAdapter,
    DogsUnchainedStakingContractAdapter,
    // NFTWEscrowStakingContractAdapter,
    PerionCreditsStakingContractAdapter,
    // DigitzStakingContractAdapter,
    DogfaceStakingContractAdapter,
    Dogface2ndStakingContractAdapter,
    ReNFTEthereumSylvesterV0StakingContractAdapter,
    ReNFTPolygonSylvesterV1StakingContractAdapter,
    ReplicantXStakingContractAdapter,
    CbzGrowStakingContractAdapter,
    GenKStakingContractAdapter,
    MeltdownContractAdapter,
    AngelBlockStakingContractAdapter,
    BapeliensStakingContractAdapter,
    OmniguardEternalsStakingContractAdapter,
    MoonrunnersStakingContractAdapter,
    WarriorsofankhStakingContractAdapter,
    XenoStakingContractAdapter,
    PlutoallianceStakingAdapter,
    TtooStakingContractAdapter,
    PrimordiaStakingContractAdapter,
    JnglStakingContractAdapter,
    SupremeKongStakingContractAdapter,
    SupremeKong2StakingContractAdapter,
    SugartownStakingContractAdapter,
    BansheesStakingContractAdapter,
    FlooringProtocolStakingContractAdapter,
    HabibizRoyalsStakingContractAdapter,
    DwebEthereumStakingContractAdapter,
    DwebPolygonStakingContractAdapter,
  ];
  constructor() {}
}
