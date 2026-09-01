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
import {ChillRxStakingContractAdapter} from './adapters/chillrx.adapter.js';
import {CocoStakingContractAdapter} from './adapters/coco.adapter.js';
import {DogfaceStakingContractAdapter} from './adapters/dogface.adapter.js';
import {Dogface2ndStakingContractAdapter} from './adapters/dogface2.adapter.js';
import {DogsUnchainedStakingContractAdapter} from './adapters/dogs-unchained.adapter.js';
import {
  E4CGoldStakingContractAdapter,
  E4CRangerStakingContractAdapter,
} from './adapters/e4c-ranger-staking.adapter.js';
import {PerionCreditsStakingContractAdapter} from './adapters/erc20-staking.adapter.js';
import {IdolMarketplaceContractAdapter} from './adapters/idol-marketplace.adapter.js';
import {LifestoryPlanetStakingAdapter} from './adapters/lifestory-planet-staking.adapter.js';
import {LuckyNFTStakingContractAdapter} from './adapters/luckynft.adapter.js';
import {MeltdownContractAdapter} from './adapters/meltdown-1.adapter.js';
import {Meltdown03ContractAdapter} from './adapters/meltdown.adapter.js';

import {AngelBlockStakingContractAdapter} from './adapters/ab.adapter.js';
import {AcolytStakingContractAdapter} from './adapters/acolyt-staking.adapter.js';
import {BansheesStakingContractAdapter} from './adapters/banshees-staking.adapter.js';
import {BapeliensStakingContractAdapter} from './adapters/bapeliens-staking.adapter.js';
import {BibizStakingContractAdapter} from './adapters/bibiz.adapter.js';
import {BlastminersStakingContractAdapter} from './adapters/blastminers.adapter.js';
import {BlastopiansStakingContractAdapter} from './adapters/blastopians.adapter.js';
import {CbzGrowStakingContractAdapter} from './adapters/cbzgrow.adapter.js';
import {CWStakingContractAdapter} from './adapters/cw-adapter.js';
import {
  DwebEthereumStakingContractAdapter,
  DwebPolygonStakingContractAdapter,
} from './adapters/dweb-staking.adapter.js';
import {
  DwebUniV2EthereumStakingContractAdapter,
  DwebUniV2PolygonStakingContractAdapter,
} from './adapters/dweb-uni-v2-staking.adapter.js';
import {FlooringProtocolStakingContractAdapter} from './adapters/flooring-protocol-staking.adapter.js';
import {GenKStakingContractAdapter} from './adapters/genk-staking.adapter.js';
import {HabibizRoyalsStakingContractAdapter} from './adapters/habibiz-royals.adapter.js';
import {JnglStakingContractAdapter} from './adapters/Jngl-staking.adapter.js';
import {LilyStakingAdapter} from './adapters/lily-token.adapter.js';
import {MoonrunnersStakingContractAdapter} from './adapters/moonrunners.adapter.js';
import {MtgStakingContractAdapter} from './adapters/mtg.adapter.js';
import {OmniguardEternalsStakingContractAdapter} from './adapters/omniguard-eternals.adapter.js';
import {PlanetXStakingV1ContractAdapter} from './adapters/planetx.v1.adapter.js';
import {PlutoallianceStakingAdapter} from './adapters/plutoalliance.adapter.js';
import {PrimordiaStakingContractAdapter} from './adapters/primordia.adapter.js';
import {
  RailgunBinanceGovernanceAdapter,
  RailgunEthereumGovernanceAdapter,
  RailgunPolygonGovernanceAdapter,
} from './adapters/railgun-governance.adapter.js';
import {RandomStakingContractAdapter} from './adapters/random-staking.adapter.js';
import {RDStakingContractAdapter} from './adapters/rd-staking.adapter.js';
import {RektDogsStakingContractAdapter} from './adapters/rekt-dogs-adapter.js';
import {
  ReNFTEthereumSylvesterV0StakingContractAdapter,
  ReNFTPolygonSylvesterV1StakingContractAdapter,
} from './adapters/renft.adapter.js';
import {ReplicantXStakingContractAdapter} from './adapters/replicantx-staking.adapter.js';
import {RevenueCoinStakingContractAdapter} from './adapters/revenue.adapter.js';
import {RirisuStakingContractAdapter} from './adapters/ririsu.adapter.js';
import {RivalBearsStakingContractAdapter} from './adapters/rival-bears-staking.adapter.js';
import {RoboStakingContractAdapter} from './adapters/robo.adapter.js';
import {SkyFarmStakingContractAdapter} from './adapters/sky-farm.adapter.js';
import {SpitYardContractAdapter} from './adapters/spit-yard.adapter.js';
import {StartStakingContractAdapter} from './adapters/start.adapter.js';
import {SugartownStakingContractAdapter} from './adapters/sugartown.adapter.js';
import {SuperverseStakingContractAdapter} from './adapters/superverse-staking.adapter.js';
import {SupremeKong2StakingContractAdapter} from './adapters/supreme-kong-2-staking.adapter.js';
import {SupremeKongStakingContractAdapter} from './adapters/supreme-kong-staking.adapter.js';
import {TtooStakingContractAdapter} from './adapters/ttoo-staking.adapter.js';
import {UwULendStakingContractAdapter} from './adapters/uwulend-staking.adapter.js';
import {W3ABPassContractAdapter} from './adapters/W3ABPass.adapter.js';
import {WarriorsofankhStakingContractAdapter} from './adapters/warriorsofankh-staking.adapter.js';
import {XenoStakingContractAdapter} from './adapters/xeno-mining.adapter.js';
import {STAKING_CONTRACTS_COMPONENT} from './keys.js';
import {StakingContractsService} from './services/staking-contracts.service.js';

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
    LuckyNFTStakingContractAdapter,
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
    CWStakingContractAdapter,
    JnglStakingContractAdapter,
    SupremeKongStakingContractAdapter,
    SupremeKong2StakingContractAdapter,
    SugartownStakingContractAdapter,
    BansheesStakingContractAdapter,
    BlastopiansStakingContractAdapter,
    FlooringProtocolStakingContractAdapter,
    BibizStakingContractAdapter,
    HabibizRoyalsStakingContractAdapter,
    DwebEthereumStakingContractAdapter,
    DwebPolygonStakingContractAdapter,
    DwebUniV2EthereumStakingContractAdapter,
    DwebUniV2PolygonStakingContractAdapter,
    SuperverseStakingContractAdapter,
    StartStakingContractAdapter,
    BlastminersStakingContractAdapter,
    RailgunBinanceGovernanceAdapter,
    RailgunEthereumGovernanceAdapter,
    RailgunPolygonGovernanceAdapter,
    PlanetXStakingV1ContractAdapter,
    RevenueCoinStakingContractAdapter,
    W3ABPassContractAdapter,
    AcolytStakingContractAdapter,
    LilyStakingAdapter,
  ];
  constructor() {}
}
